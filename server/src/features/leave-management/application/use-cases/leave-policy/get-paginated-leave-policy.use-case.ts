import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeavePolicyRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_POLICY_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeavePolicy } from '@/features/leave-management/domain/models';

@Injectable()
export class GetPaginatedLeavePolicyUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly leavePolicyRepository: LeavePolicyRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<LeavePolicy>> {
    return this.transactionHelper.executeTransaction(
      LEAVE_POLICY_ACTIONS.PAGINATED_LIST,
      async (manager) =>
        this.leavePolicyRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        ),
    );
  }
}
