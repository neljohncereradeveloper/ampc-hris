import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveBalance } from '@/features/leave-management/domain/models';
import { LeaveBalanceRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_BALANCE_ACTIONS,
} from '@/features/leave-management/domain/constants';

/**
 * Resolves the single leave balance for (employee, leave type, year).
 * Used when creating or updating a leave request to get the balance to attach.
 */
@Injectable()
export class GetLeaveBalanceByLeaveTypeUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly repo: LeaveBalanceRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    employee_id: number,
    leave_type_id: number,
    year: string,
  ): Promise<LeaveBalance | null> {
    return this.transactionHelper.executeTransaction(
      LEAVE_BALANCE_ACTIONS.GET_BY_LEAVE_TYPE,
      async (manager) =>
        this.repo.findByLeaveType(employee_id, leave_type_id, year, manager),
    );
  }
}
