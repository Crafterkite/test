import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
  Matches,
} from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({
    example: 'Acme Creative Studios',
    description: 'Display name for the organization',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Organization name is required' })
  @MinLength(2, { message: 'Organization name must be at least 2 characters' })
  @MaxLength(100, { message: 'Organization name must not exceed 100 characters' })
  name!: string;

  @ApiProperty({
    example: 'acme-creative-studios',
    description:
      'URL-safe unique identifier for the organization. Only lowercase letters, numbers, and hyphens. Must start with a letter.',
    minLength: 2,
    maxLength: 63,
  })
  @IsString()
  @IsNotEmpty({ message: 'Organization slug is required' })
  @MinLength(2, { message: 'Slug must be at least 2 characters' })
  @MaxLength(63, { message: 'Slug must not exceed 63 characters' })
  @Matches(/^[a-z][a-z0-9-]*[a-z0-9]$/, {
    message:
      'Slug must start with a lowercase letter, contain only lowercase letters, numbers, and hyphens, and not end with a hyphen',
  })
  slug!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/logos/acme.png',
    description: 'URL to the organization logo image',
  })
  @IsOptional()
  @IsUrl({}, { message: 'logoUrl must be a valid URL' })
  @MaxLength(2048, { message: 'Logo URL must not exceed 2048 characters' })
  logoUrl?: string;
}

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}

export class OrganizationResponseDto {
  @ApiProperty({ example: 'clx1abc123' })
  id!: string;

  @ApiProperty({ example: 'Acme Creative Studios' })
  name!: string;

  @ApiProperty({ example: 'acme-creative-studios' })
  slug!: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logos/acme.png', nullable: true })
  logoUrl!: string | null;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  updatedAt!: Date;
}

export class OrganizationWithMembershipResponseDto extends OrganizationResponseDto {
  @ApiProperty({ example: 'OWNER', description: 'Current user role in this organization' })
  membershipRole!: string;
}
