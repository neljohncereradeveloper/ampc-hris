import { ApiProperty } from '@nestjs/swagger';
import { REGEX_CONST } from '@/features/shared-domain/domain/constants';
import { OptionalStringValidation, RequiredNumberValidation } from '@/core/infrastructure/decorators';

export class GetPaginatedPendingLeaveRequestsDto {
  @ApiProperty({
    description: 'Search term to filter results',
    example: '',
    minLength: 0,
    maxLength: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE.toString(),
  })
  @OptionalStringValidation({
    field_name: 'Search term',
    min_length: 0,
    max_length: 255,
    pattern: REGEX_CONST.LETTER_NUMBER_SPACE,
    pattern_message:
      'Search term can only contain letters, numbers, spaces, hyphens, and dots',
    sanitize: true,
  })
  term?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: '1',
    default: '1',
  })
  @RequiredNumberValidation({
    field_name: 'Page Number',
    min: 0,
    max: 150,
    allow_zero: true,
    allow_negative: false,
    transform: true,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: '10',
    default: '10',
    maximum: 100,
  })
  @RequiredNumberValidation({
    field_name: 'Page Limit',
    min: 0,
    max: 150,
    allow_zero: true,
    allow_negative: false,
    transform: true,
  })
  limit: number;
}
