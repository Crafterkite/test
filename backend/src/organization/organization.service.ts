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
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationResponseDto,
  OrganizationWithMembershipResponseDto,
} from './dto/create-organization.dto';
import { MembershipRole } from '@prisma/client';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new organization and automatically assigns the creating user
   * as an OWNER via a Membership record. Uses a transaction to ensure atomicity.
   */
  async create(
    dto: CreateOrganizationDto,
    userId: string,
  ): Promise<OrganizationResponseDto> {
    const existing = await this.prisma.organization.findUnique({
      where: { slug: dto.slug },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException(
        `An organization with the slug "${dto.slug}" already exists. Please choose a different slug.`,
      );
    }

    try {
      const result = await this.prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
          data: {
            name: dto.name.trim(),
            slug: dto.slug.trim().toLowerCase(),
            logoUrl: dto.logoUrl ?? null,
          },
        });

        await tx.membership.create({
          data: {
            orgId: organization.id,
            userId,
            role: MembershipRole.OWNER,
          },
        });

        return organization;
      });

      this.logger.log(`Organization created: ${result.slug} (${result.id}) by user ${userId}`);
      return this.mapToResponseDto(result);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      this.logger.error('Failed to create organization', error);
      throw new InternalServerErrorException('Failed to create organization.');
    }
  }

  /**
   * Returns all organizations the given user is a member of,
   * including their membership role in each.
   */
  async findMyOrganizations(
    userId: string,
  ): Promise<OrganizationWithMembershipResponseDto[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: {
        organization: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return memberships.map((membership) => ({
      ...this.mapToResponseDto(membership.organization),
      membershipRole: membership.role,
    }));
  }

  /**
   * Returns a single organization by ID. Verifies the requesting user
   * has an active membership in the organization.
   */
  async findOne(
    orgId: string,
    userId: string,
  ): Promise<OrganizationWithMembershipResponseDto> {
    const membership = await this.prisma.membership.findUnique({
      where: {
        orgId_userId: { orgId, userId },
      },
      include: {
        organization: true,
      },
    });

    if (!membership) {
      // Return 404 to avoid leaking existence of orgs the user isn't part of
      throw new NotFoundException(
        `Organization not found or you do not have access to it.`,
      );
    }

    return {
      ...this.mapToResponseDto(membership.organization),
      membershipRole: membership.role,
    };
  }

  /**
   * Updates an organization. Only OWNER or ADMIN members may perform updates.
   */
  async update(
    orgId: string,
    dto: UpdateOrganizationDto,
    userId: string,
  ): Promise<OrganizationResponseDto> {
    await this.assertMembershipRole(orgId, userId, [
      MembershipRole.OWNER,
      MembershipRole.ADMIN,
    ]);

    if (dto.slug) {
      const existing = await this.prisma.organization.findFirst({
        where: {
          slug: dto.slug,
          NOT: { id: orgId },
        },
        select: { id: true },
      });

      if (existing) {
        throw new ConflictException(
          `An organization with the slug "${dto.slug}" already exists.`,
        );
      }
    }

    const updated = await this.prisma.organization.update({
      where: { id: orgId },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.slug && { slug: dto.slug.trim().toLowerCase() }),
        ...(dto.logoUrl !== undefined && { logoUrl: dto.logoUrl ?? null }),
      },
    });

    this.logger.log(`Organization updated: ${updated.slug} (${updated.id}) by user ${userId}`);
    return this.mapToResponseDto(updated);
  }

  /**
   * Deletes an organization. Only OWNER members may delete.
   */
  async remove(orgId: string, userId: string): Promise<{ message: string }> {
    await this.assertMembershipRole(orgId, userId, [MembershipRole.OWNER]);

    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true, slug: true },
    });

    if (!org) {
      throw new NotFoundException('Organization not found.');
    }

    await this.prisma.organization.delete({ where: { id: orgId } });

    this.logger.log(`Organization deleted: ${org.slug} (${org.id}) by user ${userId}`);
    return { message: `Organization "${org.slug}" has been deleted.` };
  }

  /**
   * Returns all members of an organization. Requires the requesting user
   * to be a member.
   */
  async findMembers(orgId: string, userId: string) {
    await this.assertMembership(orgId, userId);

    const memberships = await this.prisma.membership.findMany({
      where: { orgId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return memberships.map((m) => ({
      id: m.id,
      role: m.role,
      joinedAt: m.createdAt,
      user: m.user,
    }));
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
      throw new ForbiddenException('You are not a member of this organization.');
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
      throw new ForbiddenException('You are not a member of this organization.');
    }

    if (!allowedRoles.includes(membership.role)) {
      throw new ForbiddenException(
        `Insufficient permissions. Required role: ${allowedRoles.join(' or ')}.`,
      );
    }
  }

  private mapToResponseDto(org: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): OrganizationResponseDto {
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      logoUrl: org.logoUrl,
      createdAt: org.createdAt,
      updatedAt: org.updatedAt,
    };
  }
}
