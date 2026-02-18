import { OptionalStringValidation } from '@/core/infrastructure/decorators';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants/regex.constants';
import { ApiPropertyOptional } from '@nestjs/swagger';


export class ApproveLeaveRequestDto {
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


}
