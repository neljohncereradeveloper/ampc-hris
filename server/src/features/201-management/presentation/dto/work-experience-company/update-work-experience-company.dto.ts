import { RequiredStringValidation } from '@/core/infrastructure/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWorkExperienceCompanyDto {
  @ApiProperty({
    description: 'Work experience company description (desc1)',
    example: 'ABC Corporation',
    minLength: 3,
    maxLength: 255,
  })
  @RequiredStringValidation({
    field_name: 'Work experience company description (desc1)',
    min_length: 3,
    max_length: 255,
    pattern: /^[a-zA-Z0-9\s\-_&.,()!?'"]*$/,
    pattern_message:
      'Work experience company description can only contain letters, numbers, spaces, and basic punctuation',
  })
  desc1: string;
}
