import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveRequestRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_REQUEST_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveRequest } from '@/features/leave-management/domain/models';

@Injectable()
export class GetPaginatedLeaveRequestUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_REQUEST)
    private readonly leaveRequestRepository: LeaveRequestRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<LeaveRequest>> {
    const page_num = Number(page) || 1;
    const limit_num = Number(limit) || 10;
    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.PAGINATED_LIST,
      async (manager) =>
        this.leaveRequestRepository.findPaginatedList(
          term,
          page_num,
          limit_num,
          is_archived,
          manager,
        ),
    );
  }
}
