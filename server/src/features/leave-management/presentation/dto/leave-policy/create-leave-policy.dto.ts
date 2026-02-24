import {
  OptionalArrayValidation,
  OptionalNumberValidation,
  OptionalStringValidation,
  RequiredNumberValidation,
  RequiredStringValidation,
} from '@/core/infrastructure/decorators';
import {
  IsDateStringCustom,
  transformDateString,
} from '@/core/utils/date.util';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CreateLeavePolicyDto {
  @ApiProperty({
    description: 'Leave type Code',
    example: 'VL',
    minLength: 2,
    maxLength: 255,
  })
  @RequiredStringValidation({
    field_name: 'Leave type',
    min_length: 2,
    max_length: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE,
    pattern_message: 'Leave type code can only contain letters and numbers',
  })
  leave_type: string;

  @ApiProperty({
    description: 'Annual entitlement',
    example: 15,
    minimum: 0,
    maximum: 1000,
  })
  @RequiredNumberValidation({
    field_name: 'Annual entitlement',
    min: 0,
    max: 1000,
    allow_zero: true,
    allow_negative: false,
    transform: true,
  })
  annual_entitlement: number;

  @ApiProperty({
    description: 'Carry limit',
    example: 10,
    minimum: 0,
    maximum: 1000,
  })
  @RequiredNumberValidation({
    field_name: 'Carry limit',
    min: 0,
    max: 1000,
    allow_zero: true,
    allow_negative: false,
    transform: true,
  })
  carry_limit: number;

  @ApiProperty({
    description: 'Encash limit',
    example: 10,
    minimum: 0,
    maximum: 1000,
  })
  @RequiredNumberValidation({
    field_name: 'Encash limit',
    min: 0,
    max: 1000,
    allow_zero: true,
    allow_negative: false,
    transform: true,
  })
  encash_limit: number;

  @ApiProperty({
    description: 'Carried over years',
    example: 1,
    minimum: 1,
    maximum: 10,
  })
  @RequiredNumberValidation({
    field_name: 'Carried over years',
    min: 1,
    max: 10,
    allow_zero: false,
    allow_negative: false,
    transform: true,
  })
  carried_over_years: number;

  @ApiPropertyOptional({
    description: 'Minimum service months',
    example: 1,
    minimum: 0,
    maximum: 1000,
  })
  @OptionalNumberValidation({
    field_name: 'Minimum service months',
    min: 0,
    max: 1000,
    allow_zero: true,
    allow_negative: false,
    transform: true,
  })
  minimum_service_months?: number;

  @ApiPropertyOptional({
    description: 'Effective date',
    example: '',
    type: 'string',
    format: 'date',
  })
  @Transform(({ value }) => transformDateString(value))
  @IsOptional()
  @IsDateStringCustom({ message: 'Effective date must be a valid date' })
  effective_date?: Date;

  @ApiPropertyOptional({
    description: 'Expiry date',
    example: '',
    type: 'string',
    format: 'date',
  })
  @Transform(({ value }) => transformDateString(value))
  @IsOptional()
  @IsDateStringCustom({ message: 'Expiry date must be a valid date' })
  expiry_date?: Date;

  @ApiPropertyOptional({
    description: 'Remarks',
    example: 'Additional notes',
    minLength: 1,
    maxLength: 500,
  })
  @OptionalStringValidation({
    field_name: 'Remarks',
    min_length: 2,
    max_length: 500,
    pattern: REGEX_CONST.DESCRIPTION,
    pattern_message:
      'Remarks can only contain letters, numbers, spaces, hyphens, apostrophes, periods, slashes, ampersands, exclamation marks, question marks, colons, and semicolons',
  })
  remarks?: string;

  @ApiPropertyOptional({
    description: 'Allowed employment types',
    example: ['Regular', 'Probationary'],
    type: [String],
  })
  @OptionalArrayValidation({
    field_name: 'Allowed employment types',
    min_items: 0,
    max_items: 100,
  })
  allowed_employment_types?: string[];

  @ApiPropertyOptional({
    description: 'Allowed employee statuses',
    example: ['Active', 'Inactive'],
    type: [String],
  })
  @OptionalArrayValidation({
    field_name: 'Allowed employee statuses',
    min_items: 0,
    max_items: 100,
  })
  allowed_employee_statuses?: string[];

  @ApiPropertyOptional({
    description: 'Excluded weekdays',
    example: [0, 1, 2, 3, 4, 5, 6],
    type: [Number],
  })
  @OptionalArrayValidation({
    field_name: 'Excluded weekdays',
    min_items: 0,
    max_items: 7,
  })
  excluded_weekdays?: number[];
}
