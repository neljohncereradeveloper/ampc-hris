import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { CitizenshipRepository } from '@/features/201-management/domain/repositories';
import {
  CITIZENSHIP_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxCitizenshipUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.CITIZENSHIP)
    private readonly citizenshipRepository: CitizenshipRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      CITIZENSHIP_ACTIONS.COMBOBOX,
      async (manager) => {
        const citizenships = await this.citizenshipRepository.combobox(manager);
        return citizenships.map((citizenship: { desc1: string }) => ({
          value: citizenship.desc1 || '',
          label: citizenship.desc1
            ? citizenship.desc1.charAt(0).toUpperCase() +
            citizenship.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
