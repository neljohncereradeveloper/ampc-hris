import { RequiredStringValidation } from '@/core/infrastructure/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEducationCourseDto {
  @ApiProperty({
    description: 'Education course description (desc1)',
    example: 'Computer Science',
    minLength: 3,
    maxLength: 255,
  })
  @RequiredStringValidation({
    field_name: 'Education course description (desc1)',
    min_length: 3,
    max_length: 255,
    pattern: /^[a-zA-Z0-9\s\-_&.,()!?'"]*$/,
    pattern_message:
      'Education course description can only contain letters, numbers, spaces, and basic punctuation',
  })
  desc1: string;
}
