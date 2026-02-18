import { OptionalStringValidation, RequiredStringValidation } from '@/core/infrastructure/decorators';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDepartmentDto {
  @ApiProperty({
    description: 'Department description (desc1)',
    example: 'Department Example',
    minLength: 2,
    maxLength: 100,
  })
  @RequiredStringValidation({
    field_name: 'Department description (desc1)',
    min_length: 2,
    max_length: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE,
    pattern_message:
      'Department description can only contain letters, numbers, and spaces',
  })
  desc1: string;

  @ApiProperty({
    description: 'Department code (code)',
    example: 'DEPT',
    minLength: 2,
    maxLength: 50,
  })
  @RequiredStringValidation({
    field_name: 'Department code (code)',
    min_length: 2,
    max_length: 50,
    pattern: REGEX_CONST.LETTER_NUMBER,
    pattern_message:
      'Department code can only contain letters and numbers',
  })
  code: string;

  @ApiProperty({
    description: 'Department designation (designation)',
    example: 'Department Designation Example',
    minLength: 2,
    maxLength: 255,
  })
  @RequiredStringValidation({
    field_name: 'Department designation (designation)',
    min_length: 2,
    max_length: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE,
    pattern_message:
      'Department designation can only contain letters and spaces',
  })
  designation: string;

  @ApiPropertyOptional({
    description: 'Department remarks (remarks)',
    example: 'Additional notes',
    minLength: 2,
    maxLength: 500,
  })
  @OptionalStringValidation({
    field_name: 'Department remarks (remarks)',
    min_length: 2,
    max_length: 500,
    pattern: REGEX_CONST.DESCRIPTION,
    pattern_message:
      'Department remarks can only contain letters, numbers, spaces, hyphens, apostrophes, periods, slashes, ampersands, exclamation marks, question marks, colons, and semicolons',
  })
  remarks?: string;
}
