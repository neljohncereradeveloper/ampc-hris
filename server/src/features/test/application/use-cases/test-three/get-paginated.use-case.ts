import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { TestThreeRepository } from '@/features/test/domain/repositories';
import {
  TEST_THREE_ACTIONS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { TestThree } from '@/features/test/domain/models';

@Injectable()
export class GetPaginatedTestThreeUseCase {
  constructor(
    @Inject(TEST_TOKENS.TEST_THREE)
    private readonly testThreeRepository: TestThreeRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<TestThree>> {
    return this.transactionHelper.executeTransaction(
      TEST_THREE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const test_threes = await this.testThreeRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return test_threes;
      },
    );
  }
}
