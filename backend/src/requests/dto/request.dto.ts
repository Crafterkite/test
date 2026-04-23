import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  IsInt,
  Min,
} from 'class-validator';
import { RequestType, RequestStatus, TurnaroundTier } from '@prisma/client';

export class CreateRequestDto {
  @ApiProperty({ example: 'Q4 Brand Campaign — Social Assets' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({ example: 'We need a full set of social media assets...' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @ApiProperty({ enum: RequestType, example: RequestType.DESIGN })
  @IsEnum(RequestType)
  type!: RequestType;

  @ApiPropertyOptional({ enum: TurnaroundTier, example: TurnaroundTier.STANDARD })
  @IsOptional()
  @IsEnum(TurnaroundTier)
  turnaroundTier?: TurnaroundTier;

  @ApiProperty({ example: 'workspace-cuid-here' })
  @IsString()
  @IsNotEmpty()
  workspaceId!: string;

  @ApiPropertyOptional({ example: '2024-12-31T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: 'assignee-user-id' })
  @IsOptional()
  @IsString()
  assigneeId?: string;

  @ApiPropertyOptional({ description: 'Flexible brief JSON data' })
  @IsOptional()
  briefFormData?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  priorityOrder?: number;
}

export class UpdateRequestDto extends PartialType(CreateRequestDto) {
  @ApiPropertyOptional({ enum: RequestStatus })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;
}

export class RequestQueryDto {
  @ApiPropertyOptional({ enum: RequestStatus })
  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus;

  @ApiPropertyOptional({ enum: RequestType })
  @IsOptional()
  @IsEnum(RequestType)
  type?: RequestType;

  @ApiPropertyOptional({ example: 'social media' })
  @IsOptional()
  @IsString()
  search?: string;
}

export class RequestResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() orgId!: string;
  @ApiProperty() workspaceId!: string;
  @ApiProperty() title!: string;
  @ApiPropertyOptional() description!: string | null;
  @ApiProperty({ enum: RequestType }) type!: RequestType;
  @ApiProperty({ enum: RequestStatus }) status!: RequestStatus;
  @ApiProperty() priorityOrder!: number;
  @ApiProperty({ enum: TurnaroundTier }) turnaroundTier!: TurnaroundTier;
  @ApiPropertyOptional() briefFormData!: Record<string, unknown> | null;
  @ApiPropertyOptional() dueDate!: Date | null;
  @ApiProperty() creatorId!: string;
  @ApiPropertyOptional() assigneeId!: string | null;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
  @ApiPropertyOptional() creator?: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
  @ApiPropertyOptional() assignee?: { id: string; firstName: string; lastName: string; avatarUrl: string | null } | null;
  @ApiPropertyOptional() workspace?: { id: string; name: string; slug: string };
}
