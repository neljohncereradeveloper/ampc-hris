import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { TestThreeRepository } from '@/features/test/domain/repositories';
import {
  TEST_THREE_ACTIONS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';

@Injectable()
export class ComboboxTestThreeUseCase {
  constructor(
    @Inject(TEST_TOKENS.TEST_THREE)
    private readonly testThreeRepository: TestThreeRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      TEST_THREE_ACTIONS.COMBOBOX,
      async (manager) => {
        const test_threes = await this.testThreeRepository.combobox(manager);
        return test_threes.map((test_three: { desc1: string }) => ({
          value: test_three.desc1 || '',
          label: test_three.desc1
            ? test_three.desc1.charAt(0).toUpperCase() +
              test_three.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
