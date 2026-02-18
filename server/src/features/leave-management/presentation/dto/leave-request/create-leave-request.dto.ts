import { OptionalStringValidation, RequiredNumberValidation, RequiredStringValidation } from '@/core/infrastructure/decorators';
import { IsDateStringCustom } from '@/core/utils/date.util';
import { transformDateString } from '@/core/utils/date.util';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';


export class CreateLeaveRequestDto {
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
        description: 'Start date',
        example: '',
        type: 'string',
        format: 'date',
    })
    @Transform(({ value }) => transformDateString(value))
    @IsDateStringCustom({ message: 'Start date must be a valid date' })
    start_date: Date;

    @ApiProperty({
        description: 'End date',
        example: '',
        type: 'string',
        format: 'date',
    })
    @Transform(({ value }) => transformDateString(value))
    @IsDateStringCustom({ message: 'End date must be a valid date' })
    end_date: Date;

    @ApiProperty({
        description: 'Leave type code',
        example: 'VL',
        minLength: 1,
        maxLength: 100,
    })
    @RequiredStringValidation({
        field_name: 'Leave type code',
        min_length: 1,
        max_length: 100,
        pattern: REGEX_CONST.LETTER_NUMBER,
        pattern_message:
            'Leave type code can only contain letters and numbers',
    })
    leave_type_code: string;


    @ApiProperty({
        description: 'Reason for leave',
        example: 'Sick leave',
        minLength: 1,
        maxLength: 100,
    })
    @RequiredStringValidation({
        field_name: 'Reason for leave',
        min_length: 1,
        max_length: 100,
        pattern: REGEX_CONST.DESCRIPTION,
        pattern_message:
            'Reason for leave can only contain letters, numbers, spaces, hyphens, apostrophes, periods, slashes, ampersands, exclamation marks, question marks, colons, and semicolons',
    })
    reason: string;

    @ApiPropertyOptional({
        description: 'Remarks',
        example: 'Additional notes',
        minLength: 1,
        maxLength: 500,
    })
    @OptionalStringValidation({
        field_name: 'Remarks',
        min_length: 2,
        max_length: 500,
        pattern: REGEX_CONST.DESCRIPTION,
        pattern_message:
            'Remarks can only contain letters, numbers, spaces, hyphens, apostrophes, periods, slashes, ampersands, exclamation marks, question marks, colons, and semicolons',
    })
    remarks?: string;

    @ApiPropertyOptional({
        description: 'Is half day',
        example: false,
    })
    @IsBoolean()
    is_half_day: boolean;
}
