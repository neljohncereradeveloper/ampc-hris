import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EmploymentTypeRepository } from '@/features/201-management/domain/repositories';
import {
  EMPLOYMENT_TYPE_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxEmploymentTypeUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_TYPE)
    private readonly employmentTypeRepository: EmploymentTypeRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      EMPLOYMENT_TYPE_ACTIONS.COMBOBOX,
      async (manager) => {
        const employment_types =
          await this.employmentTypeRepository.combobox(manager);
        return employment_types.map((employment_type: { desc1: string }) => ({
          value: employment_type.desc1 || '',
          label: employment_type.desc1
            ? employment_type.desc1.charAt(0).toUpperCase() +
            employment_type.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
