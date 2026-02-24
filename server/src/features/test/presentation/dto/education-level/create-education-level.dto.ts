import { RequiredStringValidation } from '@/core/infrastructure/decorators';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEducationLevelDto {
  @ApiProperty({
    description: 'EducationLevel description (desc1)',
    example: 'EducationLevel Example',
    minLength: 2,
    maxLength: 100,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE.toString(),
    patternProperties: {
      description: {
        pattern: REGEX_CONST.LETTER_NUMBER_SPACE.toString(),
        message:
          'EducationLevel description can only contain letters, numbers, and spaces',
      },
    },
  })
  @RequiredStringValidation({
    field_name: 'EducationLevel description (desc1)',
    min_length: 2,
    max_length: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE,
    pattern_message:
      'EducationLevel description can only contain letters, numbers, and spaces',
  })
  desc1: string;
}
