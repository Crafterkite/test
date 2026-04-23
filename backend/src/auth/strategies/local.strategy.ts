import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<{ id: string; email: string }> {
    const user = await this.authService.validateLocalUser(email, password);

    if (!user) {
      this.logger.warn(`Local strategy: invalid credentials for email ${email}`);
      throw new UnauthorizedException('Invalid email or password.');
    }

    return user;
  }
}
