import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateEmploymentTypeDto {
  @ApiProperty({
    description: 'Employment type description (desc1)',
    example: 'Part-time',
    maxLength: 255,
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  desc1: string;
}
