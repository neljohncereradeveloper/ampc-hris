import { ApiProperty } from '@nestjs/swagger';
import { RequiredStringValidation, OptionalStringValidation, RequiredDateValidation, OptionalDateValidation } from '@/core/infrastructure/decorators';

export class CreateTrainingCertificateDto {
  @ApiProperty({
    description: 'Certificate name',
    example: 'AWS Certified Solutions Architect',
    minLength: 1,
    maxLength: 255,
  })
  @RequiredStringValidation({
    field_name: 'Certificate name',
    min_length: 1,
    max_length: 255,
  })
  certificate_name: string;

  @ApiProperty({
    description: 'Issuing organization',
    example: 'Amazon Web Services',
    minLength: 1,
    maxLength: 255,
  })
  @RequiredStringValidation({
    field_name: 'Issuing organization',
    min_length: 1,
    max_length: 255,
  })
  issuing_organization: string;

  @ApiProperty({
    description: 'Issue date',
    example: '2024-01-15',
    type: String,
    format: 'date',
  })
  @RequiredDateValidation({
    field_name: 'Issue date',
  })
  issue_date: Date;

  @ApiProperty({
    description: 'Expiry date',
    example: '2027-01-15',
    type: String,
    format: 'date',
    required: false,
  })
  @OptionalDateValidation({
    field_name: 'Expiry date',
  })
  expiry_date?: Date | null;

  @ApiProperty({
    description: 'Certificate number',
    example: 'AWS-CSA-123456',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  @OptionalStringValidation({
    field_name: 'Certificate number',
    min_length: 1,
    max_length: 100,
  })
  certificate_number?: string | null;

  @ApiProperty({
    description: 'Certificate file path',
    example: '/uploads/certificates/aws-cert.pdf',
    minLength: 1,
    maxLength: 500,
    required: false,
  })
  @OptionalStringValidation({
    field_name: 'Certificate file path',
    min_length: 1,
    max_length: 500,
  })
  file_path?: string | null;
}
