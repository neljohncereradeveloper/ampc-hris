import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EmploymentTypeRepository } from '@/features/201-management/domain/repositories';
import {
  EMPLOYMENT_TYPE_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { EmploymentType } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedEmploymentTypeUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_TYPE)
    private readonly employmentTypeRepository: EmploymentTypeRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<EmploymentType>> {
    return this.transactionHelper.executeTransaction(
      EMPLOYMENT_TYPE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const employment_types =
          await this.employmentTypeRepository.findPaginatedList(
            term,
            page,
            limit,
            is_archived,
            manager,
          );
        return employment_types;
      },
    );
  }
}
