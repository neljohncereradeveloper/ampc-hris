import { RequiredStringValidation } from '@/core/infrastructure/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEducationCourseLevelDto {
  @ApiProperty({
    description: 'Education course level description (desc1)',
    example: 'Undergraduate',
    minLength: 3,
    maxLength: 255,
  })
  @RequiredStringValidation({
    field_name: 'Education course level description (desc1)',
    min_length: 3,
    max_length: 255,
    pattern: /^[a-zA-Z0-9\s\-_&.,()!?'"]*$/,
    pattern_message:
      'Education course level description can only contain letters, numbers, spaces, and basic punctuation',
  })
  desc1: string;
}
