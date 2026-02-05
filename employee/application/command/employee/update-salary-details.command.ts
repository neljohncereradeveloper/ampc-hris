import { PaymentTypeEnum } from '@core/domain/enum';

export interface UpdateSalaryDetailsCommand {
  annual_salary: number;
  monthly_salary: number;
  daily_rate: number;
  hourly_rate: number;
  pay_type: PaymentTypeEnum;
}
