import { RequiredNumberValidation, RequiredStringValidation } from '@/core/infrastructure/decorators';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';
import { ApiProperty } from '@nestjs/swagger';


export class EmployeeCloseBalanceDto {
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
}
