import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { ReferenceRepository } from '@/features/201-management/domain/repositories';
import {
  REFERENCE_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { Reference } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedReferenceUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.REFERENCE)
    private readonly referenceRepository: ReferenceRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    employee_id?: number,
  ): Promise<PaginatedResult<Reference>> {
    return this.transactionHelper.executeTransaction(
      REFERENCE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const references = await this.referenceRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          employee_id,
          manager,
        );
        return references;
      },
    );
  }
}
