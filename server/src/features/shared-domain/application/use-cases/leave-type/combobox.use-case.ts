import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveTypeRepository } from '@/features/shared-domain/domain/repositories';
import {
  LEAVE_TYPE_ACTIONS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';

@Injectable()
export class ComboboxLeaveTypeUseCase {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      LEAVE_TYPE_ACTIONS.COMBOBOX,
      async (manager) => {
        const leaveTypes = await this.leaveTypeRepository.combobox(manager);
        return leaveTypes.map((leaveType: { desc1: string }) => ({
          value: leaveType.desc1 || '',
          label: leaveType.desc1
            ? leaveType.desc1.charAt(0).toUpperCase() +
            leaveType.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
