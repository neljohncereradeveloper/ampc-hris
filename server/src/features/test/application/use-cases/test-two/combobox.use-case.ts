import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { TestTwoRepository } from '@/features/test/domain/repositories';
import {
  TEST_TWO_ACTIONS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';

@Injectable()
export class ComboboxTestTwoUseCase {
  constructor(
    @Inject(TEST_TOKENS.TEST_TWO)
    private readonly testTwoRepository: TestTwoRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      TEST_TWO_ACTIONS.COMBOBOX,
      async (manager) => {
        const test_twos = await this.testTwoRepository.combobox(manager);
        return test_twos.map((test_two: { desc1: string }) => ({
          value: test_two.desc1 || '',
          label: test_two.desc1
            ? test_two.desc1.charAt(0).toUpperCase() +
              test_two.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
