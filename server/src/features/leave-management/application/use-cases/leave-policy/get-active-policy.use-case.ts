import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeavePolicyRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_POLICY_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { LeavePolicy } from '@/features/leave-management/domain/models';

@Injectable()
export class GetActivePolicyUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly leavePolicyRepository: LeavePolicyRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(leave_type_id: number): Promise<LeavePolicy | null> {
    return this.transactionHelper.executeTransaction(
      LEAVE_POLICY_ACTIONS.GET_ACTIVE_POLICY,
      async (manager) =>
        this.leavePolicyRepository.getActivePolicy(leave_type_id, manager),
    );
  }
}
