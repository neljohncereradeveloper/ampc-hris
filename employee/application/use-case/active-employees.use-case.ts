import { Injectable, Inject } from '@nestjs/common';
import { CONSTANTS_REPOSITORY_TOKENS } from '@shared/constants';
import { EmployeeRepository } from '@core/domain/repositories';
import { Employee } from '@core/domain/models';
import { EMPLOYEE_ACTIONS } from '@core/domain/constants';
import { TransactionPort } from '@core/ports';

@Injectable()
export class RetrieveActiveEmployeesUseCase {
  constructor(
    @Inject(CONSTANTS_REPOSITORY_TOKENS.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(): Promise<Employee[]> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.RETRIEVE_ACTIVE,
      async (manager) => {
        const employees =
          await this.employeeRepository.retrieveActiveEmployees(manager);

        return employees;
      },
    );
  }
}
