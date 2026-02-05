import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { BranchRepository } from '@/features/shared-domain/domain/repositories';
import {
  BRANCH_ACTIONS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { Branch } from '@/features/shared-domain/domain/models';

@Injectable()
export class GetPaginatedBranchUseCase {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.BRANCH)
    private readonly branchRepository: BranchRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<Branch>> {
    return this.transactionHelper.executeTransaction(
      BRANCH_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const branches = await this.branchRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return branches;
      },
    );
  }
}
