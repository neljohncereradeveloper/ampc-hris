import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { DepartmentRepository } from '@/features/shared-domain/domain/repositories';
import {
  DEPARTMENT_ACTIONS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { Department } from '@/features/shared-domain/domain/models';

@Injectable()
export class GetPaginatedDepartmentUseCase {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.DEPARTMENT)
    private readonly departmentRepository: DepartmentRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<Department>> {
    return this.transactionHelper.executeTransaction(
      DEPARTMENT_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const departments = await this.departmentRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return departments;
      },
    );
  }
}
