import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { ReligionRepository } from '@/features/201-management/domain/repositories';
import {
  RELIGION_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxReligionUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.RELIGION)
    private readonly religionRepository: ReligionRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      RELIGION_ACTIONS.COMBOBOX,
      async (manager) => {
        const religions = await this.religionRepository.combobox(manager);
        return religions.map((religion: { desc1: string }) => ({
          value: religion.desc1 || '',
          label: religion.desc1
            ? religion.desc1.charAt(0).toUpperCase() +
            religion.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
