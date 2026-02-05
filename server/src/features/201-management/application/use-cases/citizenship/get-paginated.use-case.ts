import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { CitizenshipRepository } from '@/features/201-management/domain/repositories';
import {
  CITIZENSHIP_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { Citizenship } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedCitizenshipUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.CITIZENSHIP)
    private readonly citizenshipRepository: CitizenshipRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<Citizenship>> {
    return this.transactionHelper.executeTransaction(
      CITIZENSHIP_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const citizenships =
          await this.citizenshipRepository.findPaginatedList(
            term,
            page,
            limit,
            is_archived,
            manager,
          );
        return citizenships;
      },
    );
  }
}
