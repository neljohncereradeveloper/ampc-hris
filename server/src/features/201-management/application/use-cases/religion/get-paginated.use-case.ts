import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { ReligionRepository } from '@/features/201-management/domain/repositories';
import {
  RELIGION_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { Religion } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedReligionUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.RELIGION)
    private readonly religionRepository: ReligionRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<Religion>> {
    return this.transactionHelper.executeTransaction(
      RELIGION_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const religions = await this.religionRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return religions;
      },
    );
  }
}
