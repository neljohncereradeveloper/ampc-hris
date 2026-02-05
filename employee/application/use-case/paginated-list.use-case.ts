import { Injectable, Inject } from '@nestjs/common';
import { CONSTANTS_REPOSITORY_TOKENS } from '@shared/constants';
import { EmployeeRepository } from '@core/domain/repositories';
import { TransactionPort } from '@core/ports';
import { EMPLOYEE_ACTIONS } from '@core/domain/constants';

@Injectable()
export class PaginatedListEmployeeUseCase {
  constructor(
    @Inject(CONSTANTS_REPOSITORY_TOKENS.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(CONSTANTS_REPOSITORY_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ) {
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
