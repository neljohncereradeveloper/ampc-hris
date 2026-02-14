import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLeaveTypeDto {
  @ApiProperty({
    description: 'Leave type name',
    example: 'Sick Leave',
    maxLength: 100,
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Short code (e.g. VL, SL)',
    example: 'SL',
    maxLength: 50,
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  code: string;

  @ApiProperty({
    description: 'Leave type description (desc1)',
    example: 'Sick Leave',
    maxLength: 255,
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  desc1: string;

  @ApiProperty({
    description: 'Whether this leave type is paid',
    example: true,
    default: true,
  })
  @IsBoolean()
  paid: boolean;

  @ApiProperty({
    description: 'Optional remarks',
    example: 'Requires medical certificate',
    maxLength: 500,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}
