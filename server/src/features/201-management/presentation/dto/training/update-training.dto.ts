import { ApiProperty } from '@nestjs/swagger';
import { RequiredStringValidation, OptionalStringValidation, RequiredNumberValidation, RequiredDateValidation } from '@/core/infrastructure/decorators';

export class UpdateTrainingDto {
  @ApiProperty({
    description: 'Training date',
    example: '2024-01-15',
    type: String,
    format: 'date',
  })
  @RequiredDateValidation({
    field_name: 'Training date',
  })
  training_date: Date;

  @ApiProperty({
    description: 'Training certificate ID',
    example: 1,
    type: Number,
  })
  @RequiredNumberValidation({
    field_name: 'Training certificate ID',
    min: 1,
  })
  trainings_cert_id: number;

  @ApiProperty({
    description: 'Training title',
    example: 'AWS Cloud Architecture Workshop',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  @OptionalStringValidation({
    field_name: 'Training title',
    min_length: 1,
    max_length: 100,
    pattern: /^[a-zA-Z0-9\s\-_&.,()]+$/,
    pattern_message:
      'Training title can only contain letters, numbers, spaces, and basic punctuation',
  })
  training_title?: string;

  @ApiProperty({
    description: 'Description',
    example: 'Comprehensive training on AWS cloud architecture',
    minLength: 1,
    maxLength: 500,
    required: false,
  })
  @OptionalStringValidation({
    field_name: 'Description',
    min_length: 1,
    max_length: 500,
    pattern: /^[a-zA-Z0-9\s\-_&.,()]+$/,
    pattern_message:
      'Description can only contain letters, numbers, spaces, and basic punctuation',
  })
  desc1?: string;

  @ApiProperty({
    description: 'Training image path',
    example: '/uploads/trainings/aws-workshop.jpg',
    minLength: 1,
    maxLength: 500,
    required: false,
  })
  @OptionalStringValidation({
    field_name: 'Training image path',
    min_length: 1,
    max_length: 500,
  })
  image_path?: string;
}
