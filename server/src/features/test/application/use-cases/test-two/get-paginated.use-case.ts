import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { TestTwoRepository } from '@/features/test/domain/repositories';
import {
  TEST_TWO_ACTIONS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { TestTwo } from '@/features/test/domain/models';

@Injectable()
export class GetPaginatedTestTwoUseCase {
  constructor(
    @Inject(TEST_TOKENS.TEST_TWO)
    private readonly testTwoRepository: TestTwoRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<TestTwo>> {
    return this.transactionHelper.executeTransaction(
      TEST_TWO_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const test_twos = await this.testTwoRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return test_twos;
      },
    );
  }
}
