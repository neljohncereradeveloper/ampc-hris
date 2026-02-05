import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateJobtitleDto {
  @ApiProperty({
    description: 'Jobtitle description (desc1)',
    example: 'Software Engineer',
    maxLength: 255,
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  desc1: string;
}
