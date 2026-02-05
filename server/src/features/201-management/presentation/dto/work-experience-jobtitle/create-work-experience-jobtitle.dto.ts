import { RequiredStringValidation } from '@/core/infrastructure/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkExperienceJobTitleDto {
  @ApiProperty({
    description: 'Work experience job title description (desc1)',
    example: 'Software Engineer',
    minLength: 3,
    maxLength: 255,
  })
  @RequiredStringValidation({
    field_name: 'Work experience job title description (desc1)',
    min_length: 3,
    max_length: 255,
    pattern: /^[a-zA-Z0-9\s\-_&.,()!?'"]*$/,
    pattern_message:
      'Work experience job title description can only contain letters, numbers, spaces, and basic punctuation',
  })
  desc1: string;
}
