import { ApiProperty } from '@nestjs/swagger';
import { RequiredStringValidation, OptionalStringValidation, OptionalNumberValidation } from '@/core/infrastructure/decorators';

export class CreateReferenceDto {
  @ApiProperty({
    description: 'Employee ID',
    example: 1,
    required: false,
  })
  @OptionalNumberValidation({
    field_name: 'Employee ID',
    min: 1,
  })
  employee_id?: number;

  @ApiProperty({
    description: 'First name',
    example: 'John',
    minLength: 1,
    maxLength: 100,
  })
  @RequiredStringValidation({
    field_name: 'First name',
    min_length: 1,
    max_length: 100,
    pattern: /^[a-zA-Z\s\-'.,]+$/,
    pattern_message:
      'First name can only contain letters, spaces, hyphens, apostrophes, and periods',
  })
  fname: string;

  @ApiProperty({
    description: 'Middle name',
    example: 'Michael',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  @OptionalStringValidation({
    field_name: 'Middle name',
    min_length: 1,
    max_length: 100,
    pattern: /^[a-zA-Z\s\-'.,]+$/,
    pattern_message:
      'Middle name can only contain letters, spaces, hyphens, apostrophes, and periods',
  })
  mname?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Doe',
    minLength: 1,
    maxLength: 100,
  })
  @RequiredStringValidation({
    field_name: 'Last name',
    min_length: 1,
    max_length: 100,
    pattern: /^[a-zA-Z\s\-'.,]+$/,
    pattern_message:
      'Last name can only contain letters, spaces, hyphens, apostrophes, and periods',
  })
  lname: string;

  @ApiProperty({
    description: 'Suffix',
    example: 'Jr.',
    minLength: 1,
    maxLength: 10,
    required: false,
  })
  @OptionalStringValidation({
    field_name: 'Suffix',
    min_length: 1,
    max_length: 10,
    pattern: /^[a-zA-Z.]+$/,
    pattern_message: 'Suffix can only contain letters and periods',
  })
  suffix?: string;

  @ApiProperty({
    description: 'Cellphone number',
    example: '+639123456789',
    minLength: 10,
    maxLength: 15,
    required: false,
  })
  @OptionalStringValidation({
    field_name: 'Cellphone number',
    min_length: 10,
    max_length: 15,
    pattern: /^[0-9+\-\s()]+$/,
    pattern_message:
      'Cellphone number can only contain numbers, plus signs, hyphens, spaces, and parentheses',
  })
  cellphone_number?: string;
}
