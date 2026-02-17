import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEmail,
  MaxLength,
} from 'class-validator';
import {
  GenderEnum,
  LaborClassificationEnum,
  LaborClassificationStatusEnum,
} from '@/features/shared-domain/domain/enum';
import { IsDateStringCustom, transformDateString } from '@/core/utils/date.util';
import { Transform } from 'class-transformer';

export class CreateEmployeeDto {
  /** Employment information (descriptions from combobox) */
  @ApiProperty({
    description: 'Job title description',
    example: 'Software Engineer',
  })
  @IsString()
  @IsNotEmpty()
  job_title: string;

  @ApiProperty({
    description: 'Employment type description',
    example: 'Regular',
  })
  @IsString()
  @IsNotEmpty()
  employment_type: string;

  @ApiProperty({
    description: 'Employment status description',
    example: 'Active',
  })
  @IsString()
  @IsNotEmpty()
  employment_status: string;

  @ApiProperty({
    description: 'Leave type description',
    example: 'Sick Leave',
    required: false,
  })
  @IsString()
  @IsOptional()
  leave_type?: string;

  @ApiProperty({ description: 'Branch description', example: 'Main Office' })
  @IsString()
  @IsNotEmpty()
  branch: string;

  @ApiProperty({ description: 'Department description', example: 'IT' })
  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    description: 'Hire date',
    example: '',
    type: 'string',
    format: 'date',
  })
  @Transform(({ value }) => transformDateString(value))
  @IsDateStringCustom({ message: 'Hire date must be a valid date' })
  hire_date: Date;

  @ApiProperty({ description: 'Employee ID number', example: 'EMP001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  id_number: string;

  @ApiProperty({
    description: 'Biometric number',
    example: 'BIO001',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  bio_number?: string;

  @ApiProperty({
    description: 'Image path',
    example: '/images/emp001.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  image_path?: string;

  /** Personal information */
  @ApiProperty({ description: 'First name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  first_name: string;

  @ApiProperty({
    description: 'Middle name',
    example: 'Michael',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  middle_name?: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  last_name: string;

  @ApiProperty({ description: 'Suffix', example: 'Jr.', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  suffix?: string;

  @ApiProperty({
    description: 'Birth date',
    example: '',
    type: 'string',
    format: 'date',
  })
  @Transform(({ value }) => transformDateString(value))
  @IsDateStringCustom({ message: 'Birth date must be a valid date' })
  birth_date: Date;

  @ApiProperty({
    description: 'Religion description',
    example: 'Roman Catholic',
  })
  @IsString()
  @IsNotEmpty()
  religion: string;

  @ApiProperty({ description: 'Civil status description', example: 'Single' })
  @IsString()
  @IsNotEmpty()
  civil_status: string;

  @ApiProperty({ description: 'Age', example: 30, required: false })
  @IsNumber()
  @IsOptional()
  age?: number;

  @ApiProperty({
    description: 'Gender',
    enum: GenderEnum,
    example: GenderEnum.MALE,
    required: false,
  })
  @IsOptional()
  gender?: GenderEnum;

  @ApiProperty({ description: 'Citizenship description', example: 'Filipino' })
  @IsString()
  @IsNotEmpty()
  citizenship: string;

  @ApiProperty({ description: 'Height', example: 170.5, required: false })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiProperty({ description: 'Weight', example: 70.5, required: false })
  @IsNumber()
  @IsOptional()
  weight?: number;

  /** Address information */
  @ApiProperty({ description: 'Home address street', example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  home_address_street: string;

  @ApiProperty({
    description: 'Home address barangay description',
    example: 'Barangay 1',
  })
  @IsString()
  @IsNotEmpty()
  home_address_barangay: string;

  @ApiProperty({
    description: 'Home address city description',
    example: 'Manila',
  })
  @IsString()
  @IsNotEmpty()
  home_address_city: string;

  @ApiProperty({
    description: 'Home address province description',
    example: 'Metro Manila',
  })
  @IsString()
  @IsNotEmpty()
  home_address_province: string;

  @ApiProperty({ description: 'Home address zip code', example: '1234' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  home_address_zip_code: string;

  @ApiProperty({
    description: 'Present address street',
    example: '456 Oak Ave',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  present_address_street?: string;

  @ApiProperty({
    description: 'Present address barangay description',
    example: 'Barangay 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  present_address_barangay?: string;

  @ApiProperty({
    description: 'Present address city description',
    example: 'Manila',
    required: false,
  })
  @IsString()
  @IsOptional()
  present_address_city?: string;

  @ApiProperty({
    description: 'Present address province description',
    example: 'Metro Manila',
    required: false,
  })
  @IsString()
  @IsOptional()
  present_address_province?: string;

  @ApiProperty({
    description: 'Present address zip code',
    example: '5678',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  present_address_zip_code?: string;

  /** Contact information */
  @ApiProperty({
    description: 'Cellphone number',
    example: '+639123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  cellphone_number?: string;

  @ApiProperty({
    description: 'Telephone number',
    example: '02-1234-5678',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  telephone_number?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email?: string;

  /** Emergency contact information */
  @ApiProperty({
    description: 'Emergency contact name',
    example: 'Jane Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  emergency_contact_name?: string;

  @ApiProperty({
    description: 'Emergency contact number',
    example: '+639123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  emergency_contact_number?: string;

  @ApiProperty({
    description: 'Emergency contact relationship',
    example: 'Spouse',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  emergency_contact_relationship?: string;

  @ApiProperty({
    description: 'Emergency contact address',
    example: '789 Pine St',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  emergency_contact_address?: string;

  /** Family information */
  @ApiProperty({
    description: 'Husband or wife name',
    example: 'Jane Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  husband_or_wife_name?: string;

  @ApiPropertyOptional({
    description: 'Husband or wife birth date',
    example: '',
    type: 'string',
    format: 'date',
    required: false,
  })
  @Transform(({ value }) => transformDateString(value))
  @IsOptional()
  @IsDateStringCustom({ message: 'Husband or wife birth date must be a valid date' })
  husband_or_wife_birth_date?: Date;

  @ApiProperty({
    description: 'Husband or wife occupation',
    example: 'Teacher',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  husband_or_wife_occupation?: string;

  @ApiProperty({
    description: 'Number of children',
    example: 2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  number_of_children?: number;

  @ApiProperty({
    description: 'Fathers name',
    example: 'John Doe Sr.',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  fathers_name?: string;

  @ApiPropertyOptional({
    description: 'Husband or wife birth date',
    example: '',
    type: 'string',
    format: 'date',
    required: false,
  })
  @Transform(({ value }) => transformDateString(value))
  @IsOptional()
  @IsDateStringCustom({ message: 'Fathers birth date must be a valid date' })
  fathers_birth_date?: Date;

  @ApiProperty({
    description: 'Fathers occupation',
    example: 'Engineer',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  fathers_occupation?: string;

  @ApiProperty({
    description: 'Mothers name',
    example: 'Mary Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  mothers_name?: string;

  @ApiPropertyOptional({
    description: 'Husband or wife birth date',
    example: '',
    type: 'string',
    format: 'date',
    required: false,
  })
  @Transform(({ value }) => transformDateString(value))
  @IsOptional()
  @IsDateStringCustom({ message: 'Mothers birth date must be a valid date' })
  mothers_birth_date?: Date;

  @ApiProperty({
    description: 'Mothers occupation',
    example: 'Nurse',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  mothers_occupation?: string;

  /** Remarks */
  @ApiProperty({
    description: 'Remarks',
    example: 'Additional notes',
    required: false,
  })
  @IsString()
  @IsOptional()
  remarks?: string;

  /** Active status */
  @ApiProperty({ description: 'Is active', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  /** Labor classification */
  @ApiProperty({
    description: 'Labor classification',
    enum: LaborClassificationEnum,
    required: false,
  })
  @IsOptional()
  labor_classification?: LaborClassificationEnum;

  @ApiProperty({
    description: 'Labor classification status',
    enum: LaborClassificationStatusEnum,
    required: false,
  })
  @IsOptional()
  labor_classification_status?: LaborClassificationStatusEnum;
}
