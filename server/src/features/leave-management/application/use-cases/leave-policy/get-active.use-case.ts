import { Inject, Injectable } from '@nestjs/common';
import { HTTP_STATUS, TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeavePolicyRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_POLICY_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { LeavePolicy } from '@/features/leave-management/domain/models';
import { LeaveTypeRepository } from '@/features/shared-domain/domain/repositories';
import { SHARED_DOMAIN_TOKENS } from '@/features/shared-domain/domain/constants';
import { LeavePolicyBusinessException } from '@/features/leave-management/domain';

@Injectable()
export class GetActivePolicyUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly leavePolicyRepository: LeavePolicyRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
  ) { }

  async execute(leave_type_code: string): Promise<LeavePolicy | null> {
    return this.transactionHelper.executeTransaction(
      LEAVE_POLICY_ACTIONS.GET_ACTIVE_POLICY,
      async (manager) => {
        const leave_type = await this.leaveTypeRepository.findByCode(leave_type_code, manager);
        if (!leave_type) {
          throw new LeavePolicyBusinessException(`Leave type with code "${leave_type_code}" not found`, HTTP_STATUS.NOT_FOUND);
        }
        return this.leavePolicyRepository.getActivePolicy(Number(leave_type.id), manager);
      }
    );


  }
}
