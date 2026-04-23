import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateRequestDto,
  UpdateRequestDto,
  RequestQueryDto,
  RequestResponseDto,
} from './dto/request.dto';
import { RequestStatus } from '@prisma/client';

const USER_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  avatarUrl: true,
};

const WORKSPACE_SELECT = {
  id: true,
  name: true,
  slug: true,
};

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    orgId: string,
    dto: CreateRequestDto,
    userId: string,
  ): Promise<RequestResponseDto> {
    await this.assertMembership(orgId, userId);

    try {
      const request = await this.prisma.request.create({
        data: {
          orgId,
          workspaceId: dto.workspaceId,
          title: dto.title.trim(),
          description: dto.description?.trim() ?? null,
          type: dto.type,
          turnaroundTier: dto.turnaroundTier ?? 'STANDARD',
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          assigneeId: dto.assigneeId ?? null,
          creatorId: userId,
          briefFormData: dto.briefFormData ?? null,
          priorityOrder: dto.priorityOrder ?? 1000,
        },
        include: {
          creator: { select: USER_SELECT },
          assignee: { select: USER_SELECT },
          workspace: { select: WORKSPACE_SELECT },
        },
      });

      this.logger.log(`Request created: ${request.id} in org ${orgId} by user ${userId}`);
      return request as RequestResponseDto;
    } catch (error) {
      this.logger.error('Failed to create request', error);
      throw new InternalServerErrorException('Failed to create request.');
    }
  }

  async findAll(
    orgId: string,
    userId: string,
    query: RequestQueryDto,
  ): Promise<RequestResponseDto[]> {
    await this.assertMembership(orgId, userId);

    const where: Record<string, unknown> = { orgId };

    if (query.status) where.status = query.status;
    if (query.type) where.type = query.type;
    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }

    const requests = await this.prisma.request.findMany({
      where,
      orderBy: [{ priorityOrder: 'asc' }, { createdAt: 'desc' }],
      include: {
        creator: { select: USER_SELECT },
        assignee: { select: USER_SELECT },
        workspace: { select: WORKSPACE_SELECT },
      },
    });

    return requests as RequestResponseDto[];
  }

  async findOne(
    orgId: string,
    requestId: string,
    userId: string,
  ): Promise<RequestResponseDto> {
    await this.assertMembership(orgId, userId);

    const request = await this.prisma.request.findFirst({
      where: { id: requestId, orgId },
      include: {
        creator: { select: USER_SELECT },
        assignee: { select: USER_SELECT },
        workspace: { select: WORKSPACE_SELECT },
      },
    });

    if (!request) {
      throw new NotFoundException(`Request "${requestId}" not found in this organization.`);
    }

    return request as RequestResponseDto;
  }

  async update(
    orgId: string,
    requestId: string,
    dto: UpdateRequestDto,
    userId: string,
  ): Promise<RequestResponseDto> {
    await this.assertMembership(orgId, userId);

    const existing = await this.prisma.request.findFirst({
      where: { id: requestId, orgId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException(`Request "${requestId}" not found in this organization.`);
    }

    const updated = await this.prisma.request.update({
      where: { id: requestId },
      data: {
        ...(dto.title && { title: dto.title.trim() }),
        ...(dto.description !== undefined && { description: dto.description?.trim() ?? null }),
        ...(dto.type && { type: dto.type }),
        ...(dto.status && { status: dto.status }),
        ...(dto.turnaroundTier && { turnaroundTier: dto.turnaroundTier }),
        ...(dto.dueDate !== undefined && { dueDate: dto.dueDate ? new Date(dto.dueDate) : null }),
        ...(dto.assigneeId !== undefined && { assigneeId: dto.assigneeId ?? null }),
        ...(dto.briefFormData !== undefined && { briefFormData: dto.briefFormData ?? null }),
        ...(dto.priorityOrder !== undefined && { priorityOrder: dto.priorityOrder }),
      },
      include: {
        creator: { select: USER_SELECT },
        assignee: { select: USER_SELECT },
        workspace: { select: WORKSPACE_SELECT },
      },
    });

    this.logger.log(`Request updated: ${requestId} in org ${orgId} by user ${userId}`);
    return updated as RequestResponseDto;
  }

  async remove(
    orgId: string,
    requestId: string,
    userId: string,
  ): Promise<{ message: string }> {
    await this.assertMembership(orgId, userId);

    const request = await this.prisma.request.findFirst({
      where: { id: requestId, orgId },
      select: { id: true, title: true, creatorId: true },
    });

    if (!request) {
      throw new NotFoundException(`Request "${requestId}" not found in this organization.`);
    }

    await this.prisma.request.update({
      where: { id: requestId },
      data: { status: RequestStatus.ARCHIVED },
    });

    this.logger.log(`Request archived: ${requestId} in org ${orgId} by user ${userId}`);
    return { message: `Request "${request.title}" has been archived.` };
  }

  private async assertMembership(orgId: string, userId: string): Promise<void> {
    const membership = await this.prisma.membership.findUnique({
      where: { orgId_userId: { orgId, userId } },
      select: { id: true },
    });

    if (!membership) {
      throw new ForbiddenException('You are not a member of this organization.');
    }
  }
}
