import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Guard that protects routes with JWT authentication.
 * Extends the built-in AuthGuard('jwt') to add custom error handling
 * and support for the @Public() decorator to skip auth on specific routes.
 *
 * Usage:
 *   Apply globally via APP_GUARD provider, or per-controller/handler.
 *   Mark public routes with the @Public() decorator.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if the route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser>(
    err: Error | null,
    user: TUser | false,
    info: { message?: string } | undefined,
    _context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      const message =
        err?.message ??
        info?.message ??
        'Authentication required. Please provide a valid JWT token.';

      this.logger.warn(`JWT authentication failed: ${message}`);
      throw new UnauthorizedException(message);
    }

    return user;
  }
}

/**
 * Decorator to mark a route or controller as publicly accessible,
 * bypassing the JwtAuthGuard.
 *
 * @example
 * ```typescript
 * @Public()
 * @Post('login')
 * login(@Body() dto: LoginDto) { ... }
 * ```
 */
import { SetMetadata } from '@nestjs/common';

export const Public = (): MethodDecorator & ClassDecorator =>
  SetMetadata(IS_PUBLIC_KEY, true);
