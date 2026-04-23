import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { TenantRequest } from '../middleware/tenant.middleware';

/**
 * Parameter decorator that extracts the resolved orgId from the request object.
 * The orgId is set by TenantMiddleware after validating the x-org-id header
 * against the database.
 *
 * @example
 * ```typescript
 * @Get()
 * findAll(@OrgId() orgId: string) {
 *   return this.service.findAll(orgId);
 * }
 * ```
 */
export const OrgId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<TenantRequest>();
    const orgId = request.orgId;

    if (!orgId) {
      throw new BadRequestException(
        'Organization context not found. Ensure the x-org-id header is provided.',
      );
    }

    return orgId;
  },
);

/**
 * Parameter decorator that extracts the current authenticated user from the request.
 * Relies on JwtAuthGuard having validated the JWT and attached the user payload.
 *
 * @example
 * ```typescript
 * @Get('profile')
 * getProfile(@CurrentUser() user: JwtPayload) {
 *   return user;
 * }
 * ```
 */
export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtPayload;
  },
);
