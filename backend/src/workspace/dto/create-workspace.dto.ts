import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty({
    example: 'Marketing Campaigns',
    description: 'Display name for the workspace',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Workspace name is required' })
  @MinLength(2, { message: 'Workspace name must be at least 2 characters' })
  @MaxLength(100, { message: 'Workspace name must not exceed 100 characters' })
  name!: string;

  @ApiProperty({
    example: 'marketing-campaigns',
    description:
      'URL-safe identifier for the workspace within the organization. Only lowercase letters, numbers, and hyphens.',
    minLength: 2,
    maxLength: 63,
  })
  @IsString()
  @IsNotEmpty({ message: 'Workspace slug is required' })
  @MinLength(2, { message: 'Slug must be at least 2 characters' })
  @MaxLength(63, { message: 'Slug must not exceed 63 characters' })
  @Matches(/^[a-z][a-z0-9-]*[a-z0-9]$/, {
    message:
      'Slug must start with a lowercase letter, contain only lowercase letters, numbers, and hyphens, and not end with a hyphen',
  })
  slug!: string;

  @ApiPropertyOptional({
    example: 'Workspace for all Q4 marketing campaign assets and briefs.',
    description: 'Optional description of the workspace purpose',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;
}

export class UpdateWorkspaceDto extends PartialType(CreateWorkspaceDto) {}

export class WorkspaceResponseDto {
  @ApiProperty({ example: 'clx1abc123' })
  id!: string;

  @ApiProperty({ example: 'clx0xyz789' })
  orgId!: string;

  @ApiProperty({ example: 'Marketing Campaigns' })
  name!: string;

  @ApiProperty({ example: 'marketing-campaigns' })
  slug!: string;

  @ApiPropertyOptional({
    example: 'Workspace for all Q4 marketing campaign assets.',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt!: Date;
}
