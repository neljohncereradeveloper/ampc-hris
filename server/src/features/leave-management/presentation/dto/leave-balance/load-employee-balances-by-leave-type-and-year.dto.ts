import {
  RequiredNumberValidation,
  RequiredStringValidation,
} from '@/core/infrastructure/decorators';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';
import { ApiProperty } from '@nestjs/swagger';

export class LoadEmployeeBalancesByLeaveTypeAndYearDto {
  @ApiProperty({
    description: 'Employee ID',
    example: 1,
  })
  @RequiredNumberValidation({
    field_name: 'Employee ID',
    allow_zero: false,
    allow_negative: false,
    transform: true,
  })
  employee_id: number;

  @ApiProperty({
    description: 'Year',
    example: '2025',
    minLength: 4,
    maxLength: 4,
  })
  @RequiredStringValidation({
    field_name: 'Year',
    min_length: 4,
    max_length: 4,
    pattern: REGEX_CONST.LETTER_NUMBER,
    pattern_message:
      'Year can only contain letters and numbers and must be 4 digits',
  })
  year: string;

  @ApiProperty({
    description: 'Leave type code',
    example: 'VL',
    minLength: 1,
    maxLength: 10,
  })
  @RequiredStringValidation({
    field_name: 'Leave type code',
    min_length: 1,
    max_length: 10,
    pattern: REGEX_CONST.LETTER_NUMBER,
    pattern_message: 'Leave type code can only contain letters and numbers',
  })
  leave_type_code: string;
}
