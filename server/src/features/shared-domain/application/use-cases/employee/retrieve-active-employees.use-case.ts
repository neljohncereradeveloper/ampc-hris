import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { Employee } from '@/features/shared-domain/domain/models';
import { EmployeeRepository } from '@/features/shared-domain/domain/repositories';
import {
  EMPLOYEE_ACTIONS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';

@Injectable()
export class RetrieveActiveEmployeesUseCase {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<Employee[]> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.ACTIVE_EMPLOYEES,
      async (manager) => {
        const employees =
          await this.employeeRepository.retrieveActiveEmployees(manager);
        return employees;
      },
    );
  }
}
