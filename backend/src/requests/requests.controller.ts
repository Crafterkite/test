import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
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
  ApiSecurity,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { RequestsService } from './requests.service';
import {
  CreateRequestDto,
  UpdateRequestDto,
  RequestQueryDto,
  RequestResponseDto,
} from './dto/request.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OrgId, CurrentUser, JwtPayload } from '../common/decorators/org-id.decorator';

@ApiTags('Requests')
@ApiBearerAuth('access-token')
@ApiSecurity('org-id')
@UseGuards(JwtAuthGuard)
@Controller('requests')
export class RequestsController {
  private readonly logger = new Logger(RequestsController.name);

  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new request' })
  @ApiResponse({ status: HttpStatus.CREATED, type: RequestResponseDto })
  async create(
    @OrgId() orgId: string,
    @Body() dto: CreateRequestDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<RequestResponseDto> {
    return this.requestsService.create(orgId, dto, user.sub);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List requests' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiResponse({ status: HttpStatus.OK, type: [RequestResponseDto] })
  async findAll(
    @OrgId() orgId: string,
    @CurrentUser() user: JwtPayload,
    @Query() query: RequestQueryDto,
  ): Promise<RequestResponseDto[]> {
    return this.requestsService.findAll(orgId, user.sub, query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get request by ID' })
  @ApiParam({ name: 'id', description: 'Request CUID' })
  @ApiResponse({ status: HttpStatus.OK, type: RequestResponseDto })
  async findOne(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<RequestResponseDto> {
    return this.requestsService.findOne(orgId, id, user.sub);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update request' })
  @ApiParam({ name: 'id', description: 'Request CUID' })
  @ApiResponse({ status: HttpStatus.OK, type: RequestResponseDto })
  async update(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRequestDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<RequestResponseDto> {
    return this.requestsService.update(orgId, id, dto, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive request (soft delete)' })
  @ApiParam({ name: 'id', description: 'Request CUID' })
  @ApiResponse({ status: HttpStatus.OK })
  async remove(
    @OrgId() orgId: string,
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    return this.requestsService.remove(orgId, id, user.sub);
  }
}
