import {
  RequiredNumberValidation,
  RequiredStringValidation,
  OptionalNumberValidation,
} from '@/core/infrastructure/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEducationDto {
  @ApiProperty({
    description: 'Employee ID',
    example: 1,
  })
  @RequiredNumberValidation({
    field_name: 'Employee ID',
    min: 1,
  })
  employee_id: number;

  @ApiProperty({
    description: 'Education school ID',
    example: 1,
  })
  @RequiredNumberValidation({
    field_name: 'Education school ID',
    min: 1,
  })
  education_school_id: number;

  @ApiProperty({
    description: 'Education level ID',
    example: 1,
  })
  @RequiredNumberValidation({
    field_name: 'Education level ID',
    min: 1,
  })
  education_level_id: number;

  @ApiProperty({
    description: 'Education course ID',
    example: 1,
    required: false,
  })
  @OptionalNumberValidation({
    field_name: 'Education course ID',
    min: 1,
  })
  education_course_id?: number;

  @ApiProperty({
    description: 'Education course level ID',
    example: 1,
    required: false,
  })
  @OptionalNumberValidation({
    field_name: 'Education course level ID',
    min: 1,
  })
  education_course_level_id?: number;

  @ApiProperty({
    description: 'School year',
    example: '2018-2022',
    minLength: 1,
    maxLength: 50,
  })
  @RequiredStringValidation({
    field_name: 'School year',
    min_length: 1,
    max_length: 50,
    pattern: /^[a-zA-Z0-9\s\-_&.,()]+$/,
    pattern_message:
      'School year can only contain letters, numbers, spaces, and basic punctuation',
  })
  school_year: string;
}
