import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import {
  AuthTokensResponseDto,
  AuthUserResponseDto,
  LoginResponseDto,
  RegisterResponseDto,
} from './dto/login.dto';
import { JwtPayload } from '../common/decorators/org-id.decorator';

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validates a user's credentials for the local (username/password) strategy.
   * Returns the user record (without passwordHash) if valid, or null otherwise.
   */
  async validateLocalUser(
    email: string,
    password: string,
  ): Promise<{ id: string; email: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        status: true,
      },
    });

    if (!user) {
      // Perform a dummy compare to prevent timing attacks
      await bcrypt.compare(password, '$2a$12$dummyhashfortimingattackprevention');
      return null;
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Your account has been suspended. Please contact support.');
    }

    if (user.status === 'INACTIVE') {
      throw new UnauthorizedException('Your account is inactive.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return { id: user.id, email: user.email };
  }

  /**
   * Registers a new user. Creates the user record with a hashed password
   * and returns the user data plus auth tokens.
   */
  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email address already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase().trim(),
          passwordHash,
          firstName: dto.firstName.trim(),
          lastName: dto.lastName.trim(),
          status: 'ACTIVE',
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          status: true,
          createdAt: true,
        },
      });
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new InternalServerErrorException('Failed to create user account.');
    }

    const tokens = await this.generateAndStoreTokens(user.id, user.email);

    const userResponse: AuthUserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      status: user.status,
      createdAt: user.createdAt,
    };

    return { user: userResponse, tokens };
  }

  /**
   * Logs in a user by validating their credentials (via LocalStrategy)
   * and returning the user data plus auth tokens.
   */
  async login(
    userId: string,
    userEmail: string,
  ): Promise<LoginResponseDto> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
      },
    });

    const tokens = await this.generateAndStoreTokens(user.id, user.email);

    const userResponse: AuthUserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      status: user.status,
      createdAt: user.createdAt,
    };

    return { user: userResponse, tokens };
  }

  /**
   * Refreshes an access token using a valid, non-expired refresh token.
   * The old refresh token is invalidated and a new pair is issued.
   */
  async refresh(refreshTokenValue: string): Promise<AuthTokensResponseDto> {
    if (!refreshTokenValue) {
      throw new BadRequestException('Refresh token is required.');
    }

    // Verify the JWT structure and expiry of the refresh token
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(refreshTokenValue, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      this.logger.warn('Refresh token verification failed', error);
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    // Hash the incoming token to look it up in the DB
    const hashedToken = await bcrypt.hash(refreshTokenValue, REFRESH_TOKEN_SALT_ROUNDS);

    // Find the stored refresh token by userId (sub)
    const storedToken = await this.prisma.refreshToken.findFirst({
      where: {
        userId: payload.sub,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Refresh token not found or has been revoked.');
    }

    // Validate the stored token against the provided one
    const isTokenValid = await bcrypt.compare(refreshTokenValue, storedToken.token);
    if (!isTokenValid) {
      // Possible token reuse attack — invalidate all tokens for this user
      this.logger.warn(`Possible refresh token reuse detected for user ${payload.sub}. Invalidating all tokens.`);
      await this.prisma.refreshToken.deleteMany({ where: { userId: payload.sub } });
      throw new UnauthorizedException('Refresh token is invalid. Please log in again.');
    }

    // Verify user still exists and is active
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, status: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User not found or account is not active.');
    }

    // Delete the used refresh token (rotation)
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });

    // Issue new tokens
    return this.generateAndStoreTokens(user.id, user.email);
  }

  /**
   * Invalidates a specific refresh token on logout.
   */
  async logout(refreshTokenValue: string): Promise<{ message: string }> {
    if (!refreshTokenValue) {
      throw new BadRequestException('Refresh token is required.');
    }

    try {
      // Try to decode without verifying expiry to get userId for lookup
      const payload = this.jwtService.decode<JwtPayload>(refreshTokenValue);

      if (payload?.sub) {
        // Find matching token for this user
        const tokens = await this.prisma.refreshToken.findMany({
          where: { userId: payload.sub },
        });

        for (const storedToken of tokens) {
          const matches = await bcrypt.compare(refreshTokenValue, storedToken.token);
          if (matches) {
            await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
            break;
          }
        }
      }
    } catch (error) {
      // Silent fail on logout — don't expose errors
      this.logger.warn('Logout token cleanup encountered an error (non-fatal)', error);
    }

    return { message: 'Successfully logged out.' };
  }

  /**
   * Generates a new access token and refresh token, stores the hashed
   * refresh token in the database, and returns both.
   */
  private async generateAndStoreTokens(
    userId: string,
    email: string,
  ): Promise<AuthTokensResponseDto> {
    const payload: JwtPayload = { sub: userId, email };

    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m');
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshExpiresIn,
      }),
    ]);

    // Hash the refresh token before storing
    const hashedRefreshToken = await bcrypt.hash(refreshToken, REFRESH_TOKEN_SALT_ROUNDS);

    // Calculate expiry date for the refresh token
    const refreshExpiresAt = this.parseExpiryToDate(refreshExpiresIn);

    // Prune expired tokens for this user and store the new one
    await this.prisma.$transaction([
      this.prisma.refreshToken.deleteMany({
        where: {
          userId,
          expiresAt: { lt: new Date() },
        },
      }),
      this.prisma.refreshToken.create({
        data: {
          userId,
          token: hashedRefreshToken,
          expiresAt: refreshExpiresAt,
        },
      }),
    ]);

    const expiresIn = this.parseExpiryToSeconds(accessExpiresIn);

    return { accessToken, refreshToken, expiresIn };
  }

  /**
   * Parses an expiry string like "15m", "7d", "1h" into a future Date.
   */
  private parseExpiryToDate(expiry: string): Date {
    const now = Date.now();
    const seconds = this.parseExpiryToSeconds(expiry);
    return new Date(now + seconds * 1000);
  }

  /**
   * Parses an expiry string like "15m", "7d", "1h" into seconds.
   */
  private parseExpiryToSeconds(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // default 15 minutes

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default:  return 900;
    }
  }
}
