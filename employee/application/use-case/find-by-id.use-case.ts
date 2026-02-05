import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CONSTANTS_REPOSITORY_TOKENS } from '@shared/constants';
import { EmployeeRepository } from '@core/domain/repositories';
import { EMPLOYEE_ACTIONS } from '@core/domain/constants';
import { TransactionPort } from '@core/ports';
import { NotFoundException } from '@core/exceptions/shared';

@Injectable()
export class FindEmployeeByIdUseCase {
  constructor(
    @Inject(CONSTANTS_REPOSITORY_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(id: number) {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.FIND_BY_ID,
      async (manager) => {
        const employee = await this.employeeRepository.findById(id, manager);
        if (!employee) {
          throw new NotFoundException('Employee not found');
        }

        return employee;
      },
    );
  }
}

