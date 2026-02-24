import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EducationLevelRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_LEVEL_ACTIONS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';

@Injectable()
export class ComboboxEducationLevelUseCase {
  constructor(
    @Inject(TEST_TOKENS.EDUCATION_LEVEL)
    private readonly educationLevelRepository: EducationLevelRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_LEVEL_ACTIONS.COMBOBOX,
      async (manager) => {
        const education_levels =
          await this.educationLevelRepository.combobox(manager);
        return education_levels.map((education_level: { desc1: string }) => ({
          value: education_level.desc1 || '',
          label: education_level.desc1
            ? education_level.desc1.charAt(0).toUpperCase() +
              education_level.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
