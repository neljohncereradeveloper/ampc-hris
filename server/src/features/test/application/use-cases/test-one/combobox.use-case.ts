import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { TestOneRepository } from '@/features/test/domain/repositories';
import {
  TEST_ONE_ACTIONS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';

@Injectable()
export class ComboboxTestOneUseCase {
  constructor(
    @Inject(TEST_TOKENS.TEST_ONE)
    private readonly testOneRepository: TestOneRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      TEST_ONE_ACTIONS.COMBOBOX,
      async (manager) => {
        const test_ones = await this.testOneRepository.combobox(manager);
        return test_ones.map((test_one: { desc1: string }) => ({
          value: test_one.desc1 || '',
          label: test_one.desc1
            ? test_one.desc1.charAt(0).toUpperCase() +
              test_one.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
