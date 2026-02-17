import { OptionalArrayValidation, RequiredStringValidation } from '@/core/infrastructure/decorators';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class GenerateForYearDto {
    @ApiPropertyOptional({
        description: 'Allowed employment types',
        example: ['Regular', 'Probationary'],
        type: [String],
    })
    @OptionalArrayValidation({
        field_name: 'Employment types',
        min_items: 0,
        max_items: 100
    })
    employment_types?: string[];

    @ApiPropertyOptional({
        description: 'Allowed employee statuses',
        example: ['Active', 'Inactive'],
        type: [String],
    })
    @OptionalArrayValidation({
        field_name: 'Employee statuses',
        min_items: 0,
        max_items: 100
    })
    employment_statuses?: string[];


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
