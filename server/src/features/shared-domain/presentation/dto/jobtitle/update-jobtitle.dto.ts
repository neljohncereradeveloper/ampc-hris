import { RequiredStringValidation } from '@/core/infrastructure/decorators';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateJobtitleDto {
  @ApiProperty({
    description: 'Jobtitle description (desc1)',
    example: 'Jobtitle Example',
    minLength: 2,
    maxLength: 100,
  })
  @RequiredStringValidation({
    field_name: 'Jobtitle description (desc1)',
    min_length: 2,
    max_length: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE,
    pattern_message:
      'Jobtitle description can only contain letters, numbers, and spaces',
  })
  desc1: string;
}
