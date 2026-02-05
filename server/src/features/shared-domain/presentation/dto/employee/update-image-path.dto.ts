import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateImagePathDto {
  @ApiProperty({ description: 'Image path', example: '/images/emp001.jpg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  image_path: string;
}
