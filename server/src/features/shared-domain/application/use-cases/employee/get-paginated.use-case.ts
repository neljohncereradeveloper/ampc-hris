import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EmployeeRepository } from '@/features/shared-domain/domain/repositories';
import {
  EMPLOYEE_ACTIONS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { Employee } from '@/features/shared-domain/domain/models';

@Injectable()
export class GetPaginatedEmployeeUseCase {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<Employee>> {
    return this.transactionHelper.executeTransaction(
      EMPLOYEE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const employees = await this.employeeRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return employees;
      },
    );
  }
}
