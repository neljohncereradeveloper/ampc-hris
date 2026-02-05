import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { DepartmentRepository } from '@/features/shared-domain/domain/repositories';
import {
  DEPARTMENT_ACTIONS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';

@Injectable()
export class ComboboxDepartmentUseCase {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.DEPARTMENT)
    private readonly departmentRepository: DepartmentRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      DEPARTMENT_ACTIONS.COMBOBOX,
      async (manager) => {
        const departments = await this.departmentRepository.combobox(manager);
        return departments.map((department: { desc1: string }) => ({
          value: department.desc1 || '',
          label: department.desc1
            ? department.desc1.charAt(0).toUpperCase() +
            department.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
