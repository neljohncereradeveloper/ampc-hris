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
export class GetLeaveBalanceByIdUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly repo: LeaveBalanceRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(id: number): Promise<LeaveBalance | null> {
    return this.transactionHelper.executeTransaction(
      LEAVE_BALANCE_ACTIONS.GET_BY_ID,
      async (manager) => {
        const balance = await this.repo.findById(id, manager);
        return balance;
      },
    );
  }
}
