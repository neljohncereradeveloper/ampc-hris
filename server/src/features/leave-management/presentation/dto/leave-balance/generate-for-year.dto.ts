import { OptionalArrayValidation } from '@/core/infrastructure/decorators';
import { ApiPropertyOptional } from '@nestjs/swagger';


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
}
