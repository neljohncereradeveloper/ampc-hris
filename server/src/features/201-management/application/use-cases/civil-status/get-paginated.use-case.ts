import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { CivilStatusRepository } from '@/features/201-management/domain/repositories';
import {
  CIVIL_STATUS_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { CivilStatus } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedCivilStatusUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.CIVIL_STATUS)
    private readonly civilStatusRepository: CivilStatusRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<CivilStatus>> {
    return this.transactionHelper.executeTransaction(
      CIVIL_STATUS_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const civil_statuses =
          await this.civilStatusRepository.findPaginatedList(
            term,
            page,
            limit,
            is_archived,
            manager,
          );
        return civil_statuses;
      },
    );
  }
}
