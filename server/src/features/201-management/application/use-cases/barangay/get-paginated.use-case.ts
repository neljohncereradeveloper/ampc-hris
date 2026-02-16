import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { BarangayRepository } from '@/features/201-management/domain/repositories';
import {
  BARANGAY_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { Barangay } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedBarangayUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.BARANGAY)
    private readonly barangayRepository: BarangayRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<Barangay>> {
    return this.transactionHelper.executeTransaction(
      BARANGAY_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const barangays = await this.barangayRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return barangays;
      },
    );
  }
}
