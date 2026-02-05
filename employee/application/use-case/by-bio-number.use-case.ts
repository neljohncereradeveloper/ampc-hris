import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CONSTANTS_REPOSITORY_TOKENS } from '@shared/constants';
import { EmployeeRepository } from '@core/domain/repositories';
import { EMPLOYEE_ACTIONS } from '@core/domain/constants';
import { TransactionPort } from '@core/ports';
import { NotFoundException } from '@core/exceptions/shared';

@Injectable()
export class ByBioNumberEmployeeUseCase {
  constructor(
    @Inject(CONSTANTS_REPOSITORY_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(bio_number: string) {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.FIND_BY_BIO_NUMBER,
      async (manager) => {
        const employee = await this.employeeRepository.findByBioNumber(
          bio_number,
          manager,
        );
        if (!employee) {
          throw new NotFoundException('Employee not found');
        }

        return employee;
      },
    );
  }
}
