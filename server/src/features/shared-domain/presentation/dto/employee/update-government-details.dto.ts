import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateGovernmentDetailsDto {
  @ApiProperty({ description: 'PHIC number', example: '12-345678901-2', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  phic?: string;

  @ApiProperty({ description: 'HDMF number', example: '123456789012', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  hdmf?: string;

  @ApiProperty({ description: 'SSS number', example: '34-5678901-2', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  sss_no?: string;

  @ApiProperty({ description: 'TIN number', example: '123-456-789-000', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  tin_no?: string;

  @ApiProperty({ description: 'Tax exempt code', example: 'TE001', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  tax_exempt_code?: string;
}
