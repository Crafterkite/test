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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiSecurity,
} from '@nestjs/swagger';

import { OrganizationService } from './organization.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationResponseDto,
  OrganizationWithMembershipResponseDto,
} from './dto/create-organization.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, JwtPayload, OrgId } from '../common/decorators/org-id.decorator';

@ApiTags('Organizations')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationController {
  private readonly logger = new Logger(OrganizationController.name);

  constructor(private readonly organizationService: OrganizationService) {}

  /**
   * POST /api/v1/organizations
   * Creates a new organization. The authenticated user becomes the OWNER.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new organization',
    description:
      'Creates a new organization. The authenticated user is automatically assigned as the OWNER.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Organization created successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'An organization with this slug already exists',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Authentication required',
  })
  async create(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<OrganizationResponseDto> {
    this.logger.log(`Creating organization "${dto.slug}" for user ${user.sub}`);
    return this.organizationService.create(dto, user.sub);
  }

  /**
   * GET /api/v1/organizations
   * Returns all organizations the current user is a member of.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List my organizations',
    description: "Returns all organizations the authenticated user is a member of, including their role in each.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of organizations retrieved successfully',
    type: [OrganizationWithMembershipResponseDto],
  })
  async findMyOrganizations(
    @CurrentUser() user: JwtPayload,
  ): Promise<OrganizationWithMembershipResponseDto[]> {
    return this.organizationService.findMyOrganizations(user.sub);
  }

  /**
   * GET /api/v1/organizations/:id
   * Returns a single organization by ID. Requires membership.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiSecurity('org-id')
  @ApiOperation({
    summary: 'Get organization by ID',
    description:
      'Returns a single organization. The requesting user must be a member of the organization.',
  })
  @ApiParam({ name: 'id', description: 'Organization CUID', example: 'clx1abc123' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization retrieved successfully',
    type: OrganizationWithMembershipResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Organization not found or access denied',
  })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<OrganizationWithMembershipResponseDto> {
    return this.organizationService.findOne(id, user.sub);
  }

  /**
   * PATCH /api/v1/organizations/:id
   * Updates organization details. Requires OWNER or ADMIN role.
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiSecurity('org-id')
  @ApiOperation({
    summary: 'Update organization',
    description: 'Updates organization details. Requires OWNER or ADMIN membership role.',
  })
  @ApiParam({ name: 'id', description: 'Organization CUID', example: 'clx1abc123' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization updated successfully',
    type: OrganizationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Slug already taken by another organization',
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateOrganizationDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<OrganizationResponseDto> {
    return this.organizationService.update(id, dto, user.sub);
  }

  /**
   * DELETE /api/v1/organizations/:id
   * Deletes an organization. Requires OWNER role.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiSecurity('org-id')
  @ApiOperation({
    summary: 'Delete organization',
    description: 'Permanently deletes an organization and all its data. Requires OWNER role.',
  })
  @ApiParam({ name: 'id', description: 'Organization CUID', example: 'clx1abc123' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Organization deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Organization "acme" has been deleted.' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Only OWNER can delete the organization',
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    return this.organizationService.remove(id, user.sub);
  }

  /**
   * GET /api/v1/organizations/:id/members
   * Lists all members of an organization. Requires membership.
   */
  @Get(':id/members')
  @HttpCode(HttpStatus.OK)
  @ApiSecurity('org-id')
  @ApiOperation({
    summary: 'List organization members',
    description: 'Returns all members of the organization with their roles.',
  })
  @ApiParam({ name: 'id', description: 'Organization CUID', example: 'clx1abc123' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Members list retrieved successfully',
  })
  async findMembers(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.organizationService.findMembers(id, user.sub);
  }
}
