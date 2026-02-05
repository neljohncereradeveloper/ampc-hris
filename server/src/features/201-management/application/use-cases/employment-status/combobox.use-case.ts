import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EmploymentStatusRepository } from '@/features/201-management/domain/repositories';
import {
  EMPLOYMENT_STATUS_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxEmploymentStatusUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_STATUS)
    private readonly employmentStatusRepository: EmploymentStatusRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      EMPLOYMENT_STATUS_ACTIONS.COMBOBOX,
      async (manager) => {
        const employment_statuses =
          await this.employmentStatusRepository.combobox(manager);
        return employment_statuses.map(
          (employment_status: { desc1: string }) => ({
            value: employment_status.desc1 || '',
            label: employment_status.desc1
              ? employment_status.desc1.charAt(0).toUpperCase() +
              employment_status.desc1.slice(1).toLowerCase()
              : '',
          }),
        );
      },
    );
  }
}
