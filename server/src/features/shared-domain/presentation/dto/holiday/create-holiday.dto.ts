import { RequiredStringValidation } from '@/core/infrastructure/decorators';
import { OptionalStringValidation } from '@/core/infrastructure/decorators';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import {
  IsDateStringCustom,
  transformDateString,
} from '@/core/utils/date.util';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';

export class CreateHolidayDto {
  @ApiProperty({
    description: 'Holiday name',
    example: "New Year's Day",
    minLength: 2,
    maxLength: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_UNDERSCORE.toString(),
    patternProperties: {
      description: {
        pattern: REGEX_CONST.LETTER_NUMBER_UNDERSCORE.toString(),
        message:
          'Holiday name can only contain letters, numbers, and underscores',
      },
    },
  })
  @RequiredStringValidation({
    field_name: 'Holiday name',
    min_length: 2,
    max_length: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_UNDERSCORE,
    pattern_message:
      'Holiday name can only contain letters, numbers, and underscores',
  })
  name: string;

  @ApiProperty({
    description: 'Holiday date',
    example: '2024-01-01',
    type: Date,
  })
  @Transform(({ value }) => transformDateString(value))
  @IsDateStringCustom({ message: 'Holiday date must be a valid date' })
  date: Date;

  @ApiProperty({
    description: 'Holiday type',
    example: 'national',
    minLength: 1,
    maxLength: 50,
    pattern: REGEX_CONST.LETTER_NUMBER_UNDERSCORE.toString(),
    patternProperties: {
      description: {
        pattern: REGEX_CONST.LETTER_NUMBER_UNDERSCORE.toString(),
        message:
          'Holiday type can only contain letters, numbers, and underscores',
      },
    },
  })
  @RequiredStringValidation({
    field_name: 'Holiday type',
    min_length: 2,
    max_length: 50,
    pattern: REGEX_CONST.LETTER_NUMBER_UNDERSCORE,
    pattern_message:
      'Holiday type can only contain letters, numbers, and underscores',
  })
  type: string;

  @ApiPropertyOptional({
    description: 'Description of the holiday',
    example: 'New Year celebration',
    maxLength: 1000,
    pattern: REGEX_CONST.DESCRIPTION.toString(),
    patternProperties: {
      description: {
        pattern: REGEX_CONST.DESCRIPTION.toString(),
        message:
          'Description of the holiday can only contain letters, numbers, spaces, hyphens, apostrophes, periods, slashes, ampersands, exclamation marks, question marks, colons, and semicolons',
      },
    },
  })
  @OptionalStringValidation({
    field_name: 'Description',
    max_length: 500,
    pattern: REGEX_CONST.DESCRIPTION,
    pattern_message:
      'Description can only contain letters, numbers, spaces, hyphens, apostrophes, periods, slashes, ampersands, exclamation marks, question marks, colons, and semicolons',
  })
  description?: string | null;

  @ApiPropertyOptional({
    description: 'Whether the holiday is recurring',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  is_recurring?: boolean;
}
