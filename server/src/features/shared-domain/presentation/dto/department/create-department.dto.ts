import {
  OptionalStringValidation,
  RequiredEnumValidation,
  RequiredStringValidation,
} from '@/core/infrastructure/decorators';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';
import { DepartmentScope } from '@/features/shared-domain/domain/enum/department-scope.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({
    description: 'Department description (desc1)',
    example: 'Department Example',
    minLength: 2,
    maxLength: 100,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE.toString(),
    patternProperties: {
      description: {
        pattern: REGEX_CONST.LETTER_NUMBER_SPACE.toString(),
        message:
          'Department description can only contain letters, numbers, and spaces',
      },
    },
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
    pattern: REGEX_CONST.LETTER_NUMBER.toString(),
    patternProperties: {
      description: {
        pattern: REGEX_CONST.LETTER_NUMBER.toString(),
        message: 'Department code can only contain letters and numbers',
      },
    },
  })
  @RequiredStringValidation({
    field_name: 'Department code (code)',
    min_length: 2,
    max_length: 50,
    pattern: REGEX_CONST.LETTER_NUMBER,
    pattern_message: 'Department code can only contain letters and numbers',
  })
  code: string;

  @ApiProperty({
    description: 'Department scope (scope)',
    example: DepartmentScope.HEAD_OFFICE,
  })
  @RequiredEnumValidation({
    field_name: 'Department scope (scope)',
    enum_object: DepartmentScope,
  })
  scope: DepartmentScope;

  @ApiPropertyOptional({
    description: 'Department remarks (remarks)',
    example: 'Additional notes',
    minLength: 2,
    maxLength: 500,
    pattern: REGEX_CONST.DESCRIPTION.toString(),
    patternProperties: {
      description: {
        pattern: REGEX_CONST.DESCRIPTION.toString(),
        message:
          'Department remarks can only contain letters, numbers, spaces, hyphens, apostrophes, periods, slashes, ampersands, exclamation marks, question marks, colons, and semicolons',
      },
    },
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
