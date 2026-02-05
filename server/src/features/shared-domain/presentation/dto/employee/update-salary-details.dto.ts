import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { PaymentTypeEnum } from '@/features/shared-domain/domain/enum';

export class UpdateSalaryDetailsDto {
  @ApiProperty({ description: 'Annual salary', example: 600000, required: false })
  @IsNumber()
  @IsOptional()
  annual_salary?: number;

  @ApiProperty({ description: 'Monthly salary', example: 50000, required: false })
  @IsNumber()
  @IsOptional()
  monthly_salary?: number;

  @ApiProperty({ description: 'Daily rate', example: 2000, required: false })
  @IsNumber()
  @IsOptional()
  daily_rate?: number;

  @ApiProperty({ description: 'Hourly rate', example: 250, required: false })
  @IsNumber()
  @IsOptional()
  hourly_rate?: number;

  @ApiProperty({
    description: 'Payment type',
    enum: PaymentTypeEnum,
    required: false,
  })
  @IsOptional()
  pay_type?: PaymentTypeEnum;
}
