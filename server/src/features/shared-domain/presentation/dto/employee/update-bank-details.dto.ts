import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateBankDetailsDto {
  @ApiProperty({ description: 'Bank account number', example: '1234567890', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  bank_account_number?: string;

  @ApiProperty({ description: 'Bank account name', example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  bank_account_name?: string;

  @ApiProperty({ description: 'Bank name', example: 'Bank of Example', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  bank_name?: string;

  @ApiProperty({ description: 'Bank branch', example: 'Main Branch', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  bank_branch?: string;
}
