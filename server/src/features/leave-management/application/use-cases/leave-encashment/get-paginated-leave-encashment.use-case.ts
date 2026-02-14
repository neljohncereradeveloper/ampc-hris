import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveEncashmentRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_ENCASHMENT_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveEncashment } from '@/features/leave-management/domain/models';

@Injectable()
export class GetPaginatedLeaveEncashmentUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_ENCASHMENT)
    private readonly repo: LeaveEncashmentRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<LeaveEncashment>> {
    return this.transactionHelper.executeTransaction(
      LEAVE_ENCASHMENT_ACTIONS.PAGINATED_LIST,
      async (manager) =>
        this.repo.findPaginatedList(term, page, limit, is_archived, manager),
    );
  }
}
