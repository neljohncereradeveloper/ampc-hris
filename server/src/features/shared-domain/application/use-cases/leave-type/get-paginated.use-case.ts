import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveTypeRepository } from '@/features/shared-domain/domain/repositories';
import {
  LEAVE_TYPE_ACTIONS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveType } from '@/features/shared-domain/domain/models';

@Injectable()
export class GetPaginatedLeaveTypeUseCase {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<LeaveType>> {
    return this.transactionHelper.executeTransaction(
      LEAVE_TYPE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const leaveTypes = await this.leaveTypeRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return leaveTypes;
      },
    );
  }
}
