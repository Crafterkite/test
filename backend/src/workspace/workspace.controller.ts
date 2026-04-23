import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Logger,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiSecurity,
  ApiQuery,
} from '@nestjs/swagger';

import { WorkspaceService } from './workspace.service';
import {
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
  WorkspaceResponseDto,
} from './dto/create-workspace.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrgId, CurrentUser, JwtPayload } from '../common/decorators/org-id.decorator';

@ApiTags('Workspaces')
@ApiBearerAuth('access-token')
@ApiSecurity('org-id')
@UseGuards(JwtAuthGuard)
@Controller('workspaces')
export class WorkspaceController {
  private readonly logger = new Logger(WorkspaceController.name);

  constructor(private readonly workspaceService: WorkspaceService) {}

  /**
   * POST /api/v1/workspaces
   * Creates a new workspace within the org specified by x-org-id header.
   * Requires OWNER or ADMIN membership role.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new workspace',
    description:
      'Creates a new workspace within the organization. Requires OWNER or ADMIN membership role. ' +
      'The organization is determined by the x-org-id header.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Workspace created successfully',
    type: WorkspaceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A workspace with this slug already exists in the organization',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions (requires OWNER or ADMIN)',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Missing or invalid x-org-id header',
  })
  async create(
    @OrgId() orgId: string,
    @Body() dto: CreateWorkspaceDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<WorkspaceResponseDto> {
    this.logger.log(
      `Creating workspace "${dto.slug}" in org ${orgId} by user ${user.sub}`,
    );
    return this.workspaceService.create(orgId, dto, user.sub);
  }

  /**
   * GET /api/v1/workspaces
   * Returns all workspaces in the org, with optional slug lookup.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List workspaces',
    description:
      'Returns all workspaces belonging to the organization. ' +
      'Optionally filter by slug using the ?slug= query parameter.',
  })
  @ApiQuery({
    name: 'slug',
    required: false,
    description: 'Filter workspaces by slug',
    example: 'marketing-campaigns',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Workspace list retrieved successfully',
    type: [WorkspaceResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not a member of the organization',
  })
  async findAll(
    @OrgId() orgId: string,
    @CurrentUser() user: JwtPayload,
    @Query('slug') slug?: string,
  ): Promise<WorkspaceResponseDto | WorkspaceResponseDto[]> {
    if (slug) {
      return this.workspaceService.findBySlug(orgId, slug, user.sub);
    }
    return this.workspaceService.findAll(orgId, user.sub);
  }

  /**
   * GET /api/v1/workspaces/:id
   * Returns a single workspace by ID.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get workspace by ID',
    description: 'Returns a single workspace. Requires membership in the organization.',
  })
  @ApiParam({
    name: 'id',
    description: 'Workspace CUID',
    example: 'clx2def456',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Workspace retrieved successfully',
    type: WorkspaceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workspace not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Not a member of the organization',
  })
  async findOne(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<WorkspaceResponseDto> {
    return this.workspaceService.findOne(orgId, id, user.sub);
  }

  /**
   * PATCH /api/v1/workspaces/:id
   * Updates a workspace. Requires OWNER or ADMIN role.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update workspace',
    description:
      'Updates workspace details. All fields are optional. Requires OWNER or ADMIN membership role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Workspace CUID',
    example: 'clx2def456',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Workspace updated successfully',
    type: WorkspaceResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions (requires OWNER or ADMIN)',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workspace not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Slug already taken within this organization',
  })
  async update(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWorkspaceDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<WorkspaceResponseDto> {
    return this.workspaceService.update(orgId, id, dto, user.sub);
  }

  /**
   * DELETE /api/v1/workspaces/:id
   * Deletes a workspace. Requires OWNER role.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete workspace',
    description: 'Permanently deletes a workspace. Requires OWNER membership role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Workspace CUID',
    example: 'clx2def456',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Workspace deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Workspace "Marketing Campaigns" has been deleted.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only OWNER can delete workspaces',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workspace not found',
  })
  async remove(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    return this.workspaceService.remove(orgId, id, user.sub);
  }
}
