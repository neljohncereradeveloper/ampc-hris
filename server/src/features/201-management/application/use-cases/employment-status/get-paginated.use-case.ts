import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EmploymentStatusRepository } from '@/features/201-management/domain/repositories';
import {
  EMPLOYMENT_STATUS_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { EmploymentStatus } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedEmploymentStatusUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_STATUS)
    private readonly employmentStatusRepository: EmploymentStatusRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<EmploymentStatus>> {
    return this.transactionHelper.executeTransaction(
      EMPLOYMENT_STATUS_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const employment_statuses =
          await this.employmentStatusRepository.findPaginatedList(
            term,
            page,
            limit,
            is_archived,
            manager,
          );
        return employment_statuses;
      },
    );
  }
}
