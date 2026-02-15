import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveRequestRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_REQUEST_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { LeaveRequest } from '@/features/leave-management/domain/models';

@Injectable()
export class GetLeaveRequestByIdUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_REQUEST)
    private readonly leaveRequestRepository: LeaveRequestRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(id: number): Promise<LeaveRequest | null> {
    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.GET_BY_ID,
      async (manager) => this.leaveRequestRepository.findById(id, manager),
    );
  }
}
