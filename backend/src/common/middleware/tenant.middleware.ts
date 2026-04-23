import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

export interface TenantRequest extends Request {
  orgId?: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenantMiddleware.name);

  constructor(private readonly prisma: PrismaService) {}

  async use(req: TenantRequest, res: Response, next: NextFunction): Promise<void> {
    // Skip tenant resolution for auth routes
    const path = req.path.toLowerCase();
    if (path.startsWith('/api/v1/auth') || path.startsWith('/auth')) {
      return next();
    }

    const orgId = req.headers['x-org-id'] as string | undefined;

    if (!orgId) {
      throw new BadRequestException(
        'Missing required header: x-org-id. All tenant-scoped requests must include the organization ID.',
      );
    }

    // Validate orgId format (basic CUID check - non-empty string)
    if (typeof orgId !== 'string' || orgId.trim().length === 0) {
      throw new BadRequestException('Invalid x-org-id header value.');
    }

    try {
      const organization = await this.prisma.organization.findUnique({
        where: { id: orgId.trim() },
        select: { id: true, slug: true },
      });

      if (!organization) {
        throw new NotFoundException(
          `Organization with id "${orgId}" not found.`,
        );
      }

      req.orgId = organization.id;
      this.logger.debug(`Tenant resolved: ${organization.slug} (${organization.id})`);
      next();
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      this.logger.error('Error resolving tenant', error);
      throw new BadRequestException('Failed to resolve tenant context.');
    }
  }
}
