import {
  OptionalStringValidation,
  RequiredStringValidation,
} from '@/core/infrastructure/decorators';
import {
  IsDateStringCustom,
  transformDateString,
} from '@/core/utils/date.util';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateLeaveYearConfigurationDto {
  @ApiProperty({
    description: 'Leave year configuration start date',
    example: '2025-01-01',
    minLength: 2,
    maxLength: 255,
  })
  @RequiredStringValidation({
    field_name: 'Leave year configuration start date',
    min_length: 2,
    max_length: 255,
    pattern: /^[a-zA-Z0-9\s\-_&.,()!?'"]*$/,
    pattern_message:
      'Leave year configuration start date can only contain letters, numbers, spaces, and basic punctuation',
  })
  year: string;

  @ApiProperty({
    description: 'Leave year configuration remarks',
    example: 'This is a remark',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  @OptionalStringValidation({
    field_name: 'Leave year configuration remarks',
    min_length: 1,
    max_length: 100,
    pattern: /^[a-zA-Z\s\-'.,]+$/,
    pattern_message:
      'Leave year configuration remarks can only contain letters, spaces, hyphens, apostrophes, and periods',
  })
  remarks?: string;

  @ApiProperty({
    description: 'Cutoff start date',
    example: '',
    type: 'string',
    format: 'date',
  })
  @Transform(({ value }) => transformDateString(value))
  @IsDateStringCustom({ message: 'Cutoff start date must be a valid date' })
  cutoff_start_date: Date;

  @ApiProperty({
    description: 'Cutoff end date',
    example: '',
    type: 'string',
    format: 'date',
  })
  @Transform(({ value }) => transformDateString(value))
  @IsDateStringCustom({ message: 'Cutoff end date must be a valid date' })
  cutoff_end_date: Date;
}
