import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { CivilStatusRepository } from '@/features/201-management/domain/repositories';
import {
  CIVIL_STATUS_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxCivilStatusUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.CIVIL_STATUS)
    private readonly civilStatusRepository: CivilStatusRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      CIVIL_STATUS_ACTIONS.COMBOBOX,
      async (manager) => {
        const civil_statuses =
          await this.civilStatusRepository.combobox(manager);
        return civil_statuses.map((civil_status: { desc1: string }) => ({
          value: civil_status.desc1 || '',
          label: civil_status.desc1
            ? civil_status.desc1.charAt(0).toUpperCase() +
              civil_status.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
