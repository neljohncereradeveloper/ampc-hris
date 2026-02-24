import {
  OptionalStringValidation,
  RequiredStringValidation,
} from '@/core/infrastructure/decorators';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CreateLeaveTypeDto {
  @ApiProperty({
    description: 'Leave type name (name)',
    example: 'Sick Leave',
    minLength: 2,
    maxLength: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE.toString(),
    patternProperties: {
      description: {
        pattern: REGEX_CONST.LETTER_NUMBER_SPACE.toString(),
        message:
          'Leave type name can only contain letters, numbers, and spaces',
      },
    },
  })
  @RequiredStringValidation({
    field_name: 'Leave type name (name)',
    min_length: 2,
    max_length: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE,
    pattern_message:
      'Leave type name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ApiProperty({
    description: 'Leave type code (code)',
    example: 'SL',
    minLength: 2,
    maxLength: 50,
    pattern: REGEX_CONST.LETTER_NUMBER.toString(),
    patternProperties: {
      description: {
        pattern: REGEX_CONST.LETTER_NUMBER.toString(),
        message: 'Leave type code can only contain letters and numbers',
      },
    },
  })
  @RequiredStringValidation({
    field_name: 'Leave type code (code)',
    min_length: 2,
    max_length: 50,
    pattern: REGEX_CONST.LETTER_NUMBER,
    pattern_message: 'Leave type code can only contain letters and numbers',
  })
  code: string;

  @ApiProperty({
    description: 'Leave type description (desc1)',
    example: 'Leave type description Example',
    minLength: 2,
    maxLength: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE.toString(),
    patternProperties: {
      description: {
        pattern: REGEX_CONST.LETTER_NUMBER_SPACE.toString(),
        message:
          'Leave type description can only contain letters, numbers, and spaces',
      },
    },
  })
  @RequiredStringValidation({
    field_name: 'Leave type description (desc1)',
    min_length: 2,
    max_length: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE,
    pattern_message:
      'Leave type description can only contain letters, numbers, and spaces',
  })
  desc1: string;

  @ApiProperty({
    description: 'Whether this leave type is paid',
    example: true,
    default: true,
  })
  @IsBoolean()
  paid: boolean;

  @ApiPropertyOptional({
    description: 'Remarks',
    example: 'Additional notes',
    minLength: 1,
    maxLength: 500,
    pattern: REGEX_CONST.DESCRIPTION.toString(),
    patternProperties: {
      description: {
        pattern: REGEX_CONST.DESCRIPTION.toString(),
        message:
          'Remarks can only contain letters, numbers, spaces, hyphens, apostrophes, periods, slashes, ampersands, exclamation marks, question marks, colons, and semicolons',
      },
    },
  })
  @OptionalStringValidation({
    field_name: 'Remarks',
    min_length: 1,
    max_length: 500,
    pattern: REGEX_CONST.DESCRIPTION,
    pattern_message:
      'Remarks can only contain letters, numbers, spaces, hyphens, apostrophes, periods, slashes, ampersands, exclamation marks, question marks, colons, and semicolons',
  })
  remarks?: string;
}
