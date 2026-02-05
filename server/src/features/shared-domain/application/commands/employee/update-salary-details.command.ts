import { PaymentTypeEnum } from '@/features/shared-domain/domain/enum';

/**
 * Command for updating employee salary details
 * Application layer command - simple type definition without validation
 */
export interface UpdateSalaryDetailsCommand {
  annual_salary?: number;
  monthly_salary?: number;
  daily_rate?: number;
  hourly_rate?: number;
  pay_type?: PaymentTypeEnum;
}
