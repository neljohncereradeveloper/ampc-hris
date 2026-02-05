import { RequiredStringValidation } from '@/core/infrastructure/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEducationSchoolDto {
  @ApiProperty({
    description: 'Education school description (desc1)',
    example: 'University of the Philippines',
    minLength: 3,
    maxLength: 255,
  })
  @RequiredStringValidation({
    field_name: 'Education school description (desc1)',
    min_length: 3,
    max_length: 255,
    pattern: /^[a-zA-Z0-9\s\-_&.,()!?'"]*$/,
    pattern_message:
      'Education school description can only contain letters, numbers, spaces, and basic punctuation',
  })
  desc1: string;
}
