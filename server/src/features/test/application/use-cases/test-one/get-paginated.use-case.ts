import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { TestOneRepository } from '@/features/test/domain/repositories';
import {
  TEST_ONE_ACTIONS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { TestOne } from '@/features/test/domain/models';

@Injectable()
export class GetPaginatedTestOneUseCase {
  constructor(
    @Inject(TEST_TOKENS.TEST_ONE)
    private readonly testOneRepository: TestOneRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<TestOne>> {
    return this.transactionHelper.executeTransaction(
      TEST_ONE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const test_ones = await this.testOneRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return test_ones;
      },
    );
  }
}
