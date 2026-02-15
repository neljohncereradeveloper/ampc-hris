import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeavePolicyRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_POLICY_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { LeavePolicy } from '@/features/leave-management/domain/models';

/**
 * Returns all currently active leave policies.
 * Use when the client needs to list policies (e.g. dropdown when creating a leave balance).
 */
@Injectable()
export class RetrieveActivePoliciesUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly leavePolicyRepository: LeavePolicyRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<LeavePolicy[]> {
    return this.transactionHelper.executeTransaction(
      LEAVE_POLICY_ACTIONS.RETRIEVE_ACTIVE_POLICIES,
      async (manager) =>
        this.leavePolicyRepository.retrieveActivePolicies(manager),
    );
  }
}
