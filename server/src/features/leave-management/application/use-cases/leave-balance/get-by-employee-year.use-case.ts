import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveBalance } from '@/features/leave-management/domain/models';
import { LeaveBalanceRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_BALANCE_ACTIONS,
} from '@/features/leave-management/domain/constants';

@Injectable()
export class GetLeaveBalanceByEmployeeYearUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly repo: LeaveBalanceRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    employee_id: number,
    year: string,
  ): Promise<LeaveBalance[]> {
    return this.transactionHelper.executeTransaction(
      LEAVE_BALANCE_ACTIONS.GET_BY_EMPLOYEE_YEAR,
      async (manager) =>
        this.repo.findByEmployeeYear(employee_id, year, manager),
    );
  }
}
