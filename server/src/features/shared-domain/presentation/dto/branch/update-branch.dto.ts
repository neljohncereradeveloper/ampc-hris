import { RequiredStringValidation } from '@/core/infrastructure/decorators';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBranchDto {
  @ApiProperty({
    description: 'Branch description (desc1)',
    example: 'Branch Example',
    minLength: 2,
    maxLength: 100,
  })
  @RequiredStringValidation({
    field_name: 'Branch description (desc1)',
    min_length: 2,
    max_length: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE,
    pattern_message:
      'Branch description can only contain letters, numbers, and spaces',
  })
  desc1: string;

  @ApiProperty({
    description: 'Branch code (br_code)',
    example: 'BR001',
    minLength: 1,
    maxLength: 50,
  })
  @RequiredStringValidation({
    field_name: 'Branch code (br_code)',
    min_length: 1,
    max_length: 50,
    pattern: REGEX_CONST.LETTER_NUMBER,
    pattern_message:
      'Branch code can only contain letters and numbers',
  })
  br_code: string;
}
