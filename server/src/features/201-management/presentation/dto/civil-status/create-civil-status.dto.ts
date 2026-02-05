import { RequiredStringValidation } from '@/core/infrastructure/decorators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCivilStatusDto {
  @ApiProperty({
    description: 'Civil status description (desc1)',
    example: 'Single',
    minLength: 2,
    maxLength: 255,
  })
  @RequiredStringValidation({
    field_name: 'Civil status description (desc1)',
    min_length: 2,
    max_length: 255,
    pattern: /^[a-zA-Z0-9\s\-_&.,()!?'"]*$/,
    pattern_message:
      'Civil status description can only contain letters, numbers, spaces, and basic punctuation',
  })
  desc1: string;
}
