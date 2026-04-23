import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceResponseDto,
} from './dto/create-workspace.dto';
import { MembershipRole } from '@prisma/client';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new workspace within the given organization.
   * Verifies the requesting user is an OWNER or ADMIN before creation.
   * Slug must be unique within the organization.
   */
  async create(
    orgId: string,
    dto: CreateWorkspaceDto,
    userId: string,
  ): Promise<WorkspaceResponseDto> {
    await this.assertMembershipRole(orgId, userId, [
      MembershipRole.OWNER,
      MembershipRole.ADMIN,
    ]);

    const existing = await this.prisma.workspace.findUnique({
      where: { orgId_slug: { orgId, slug: dto.slug } },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException(
        `A workspace with the slug "${dto.slug}" already exists in this organization.`,
      );
    }

    try {
      const workspace = await this.prisma.workspace.create({
        data: {
          orgId,
          name: dto.name.trim(),
          slug: dto.slug.trim().toLowerCase(),
          description: dto.description?.trim() ?? null,
        },
      });

      this.logger.log(
        `Workspace created: ${workspace.slug} (${workspace.id}) in org ${orgId} by user ${userId}`,
      );
      return this.mapToResponseDto(workspace);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      this.logger.error('Failed to create workspace', error);
      throw new InternalServerErrorException('Failed to create workspace.');
    }
  }

  /**
   * Returns all workspaces belonging to the given organization.
   * Requires the requesting user to be a member of the organization.
   */
  async findAll(orgId: string, userId: string): Promise<WorkspaceResponseDto[]> {
    await this.assertMembership(orgId, userId);

    const workspaces = await this.prisma.workspace.findMany({
      where: { orgId },
      orderBy: { createdAt: 'asc' },
    });

    return workspaces.map((ws) => this.mapToResponseDto(ws));
  }

  /**
   * Returns a single workspace by ID within the given organization.
   * Requires the requesting user to be a member of the organization.
   */
  async findOne(
    orgId: string,
    workspaceId: string,
    userId: string,
  ): Promise<WorkspaceResponseDto> {
    await this.assertMembership(orgId, userId);

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, orgId },
    });

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with id "${workspaceId}" not found in this organization.`,
      );
    }

    return this.mapToResponseDto(workspace);
  }

  /**
   * Finds a workspace by its slug within the organization.
   * Requires the requesting user to be a member of the organization.
   */
  async findBySlug(
    orgId: string,
    slug: string,
    userId: string,
  ): Promise<WorkspaceResponseDto> {
    await this.assertMembership(orgId, userId);

    const workspace = await this.prisma.workspace.findUnique({
      where: { orgId_slug: { orgId, slug } },
    });

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with slug "${slug}" not found in this organization.`,
      );
    }

    return this.mapToResponseDto(workspace);
  }

  /**
   * Updates a workspace. Requires OWNER or ADMIN membership role.
   * Slug uniqueness is enforced within the organization.
   */
  async update(
    orgId: string,
    workspaceId: string,
    dto: UpdateWorkspaceDto,
    userId: string,
  ): Promise<WorkspaceResponseDto> {
    await this.assertMembershipRole(orgId, userId, [
      MembershipRole.OWNER,
      MembershipRole.ADMIN,
    ]);

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, orgId },
      select: { id: true, slug: true },
    });

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with id "${workspaceId}" not found in this organization.`,
      );
    }

    if (dto.slug && dto.slug !== workspace.slug) {
      const slugTaken = await this.prisma.workspace.findUnique({
        where: { orgId_slug: { orgId, slug: dto.slug } },
        select: { id: true },
      });

      if (slugTaken) {
        throw new ConflictException(
          `A workspace with the slug "${dto.slug}" already exists in this organization.`,
        );
      }
    }

    const updated = await this.prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.slug && { slug: dto.slug.trim().toLowerCase() }),
        ...(dto.description !== undefined && {
          description: dto.description?.trim() ?? null,
        }),
      },
    });

    this.logger.log(
      `Workspace updated: ${updated.slug} (${updated.id}) in org ${orgId} by user ${userId}`,
    );
    return this.mapToResponseDto(updated);
  }

  /**
   * Deletes a workspace. Requires OWNER membership role.
   */
  async remove(
    orgId: string,
    workspaceId: string,
    userId: string,
  ): Promise<{ message: string }> {
    await this.assertMembershipRole(orgId, userId, [MembershipRole.OWNER]);

    const workspace = await this.prisma.workspace.findFirst({
      where: { id: workspaceId, orgId },
      select: { id: true, slug: true, name: true },
    });

    if (!workspace) {
      throw new NotFoundException(
        `Workspace with id "${workspaceId}" not found in this organization.`,
      );
    }

    await this.prisma.workspace.delete({ where: { id: workspaceId } });

    this.logger.log(
      `Workspace deleted: ${workspace.slug} (${workspace.id}) in org ${orgId} by user ${userId}`,
    );
    return { message: `Workspace "${workspace.name}" has been deleted.` };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async assertMembership(orgId: string, userId: string): Promise<void> {
    const membership = await this.prisma.membership.findUnique({
      where: { orgId_userId: { orgId, userId } },
      select: { id: true },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You are not a member of this organization.',
      );
    }
  }

  private async assertMembershipRole(
    orgId: string,
    userId: string,
    allowedRoles: MembershipRole[],
  ): Promise<void> {
    const membership = await this.prisma.membership.findUnique({
      where: { orgId_userId: { orgId, userId } },
      select: { role: true },
    });

    if (!membership) {
      throw new ForbiddenException(
        'You are not a member of this organization.',
      );
    }

    if (!allowedRoles.includes(membership.role)) {
      throw new ForbiddenException(
        `Insufficient permissions. Required role: ${allowedRoles.join(' or ')}.`,
      );
    }
  }

  private mapToResponseDto(ws: {
    id: string;
    orgId: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): WorkspaceResponseDto {
    return {
      id: ws.id,
      orgId: ws.orgId,
      name: ws.name,
      slug: ws.slug,
      description: ws.description,
      createdAt: ws.createdAt,
      updatedAt: ws.updatedAt,
    };
  }
}
