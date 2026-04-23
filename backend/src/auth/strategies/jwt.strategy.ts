import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../../common/decorators/org-id.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const { sub: userId } = payload;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, status: true },
    });

    if (!user) {
      this.logger.warn(`JWT validation failed: user ${userId} not found`);
      throw new UnauthorizedException('User not found or token is invalid.');
    }

    if (user.status === 'SUSPENDED') {
      this.logger.warn(`JWT validation failed: user ${userId} is suspended`);
      throw new UnauthorizedException('Your account has been suspended. Please contact support.');
    }

    if (user.status === 'INACTIVE') {
      this.logger.warn(`JWT validation failed: user ${userId} is inactive`);
      throw new UnauthorizedException('Your account is inactive.');
    }

    return { sub: user.id, email: user.email };
  }
}
