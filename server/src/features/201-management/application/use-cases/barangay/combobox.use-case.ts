import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { BarangayRepository } from '@/features/201-management/domain/repositories';
import {
  BARANGAY_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxBarangayUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.BARANGAY)
    private readonly barangayRepository: BarangayRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      BARANGAY_ACTIONS.COMBOBOX,
      async (manager) => {
        const barangays = await this.barangayRepository.combobox(manager);
        return barangays.map((barangay: { desc1: string }) => ({
          value: barangay.desc1 || '',
          label: barangay.desc1
            ? barangay.desc1.charAt(0).toUpperCase() +
            barangay.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
