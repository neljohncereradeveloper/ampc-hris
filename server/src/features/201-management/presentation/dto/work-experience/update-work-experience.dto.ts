import {
  OptionalNumberValidation,
  OptionalStringValidation,
} from '@/core/infrastructure/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkExperienceDto {
  @ApiProperty({
    description: 'Work experience company ID',
    example: 1,
    required: false,
  })
  @OptionalNumberValidation({
    field_name: 'Work experience company ID',
    min: 1,
  })
  company_id?: number;

  @ApiProperty({
    description: 'Work experience job title ID',
    example: 1,
    required: false,
  })
  @OptionalNumberValidation({
    field_name: 'Work experience job title ID',
    min: 1,
  })
  work_experience_job_title_id?: number;

  @ApiProperty({
    description: 'Years of experience',
    example: '5 years',
    maxLength: 50,
    required: false,
  })
  @OptionalStringValidation({
    field_name: 'Years',
    max_length: 50,
    pattern: /^[a-zA-Z0-9\s\-_&.,()]+$/,
    pattern_message:
      'Years can only contain letters, numbers, spaces, and basic punctuation',
  })
  years?: string;
}
