import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EmployeeBusinessException } from '@/features/shared-domain/domain/exceptions';
import { Employee } from '@/features/shared-domain/domain/models';
import { EmployeeRepository } from '@/features/shared-domain/domain/repositories';
import {
  EMPLOYEE_ACTIONS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';

@Injectable()
export class FindByIdNumberEmployeeUseCase {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(id_number: string): Promise<Employee> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.BY_ID_NUMBER,
      async (manager) => {
        const employee = await this.employeeRepository.findByIdNumber(
          id_number,
          manager,
        );
        if (!employee) {
          throw new EmployeeBusinessException(
            'Employee not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        return employee;
      },
    );
  }
}
