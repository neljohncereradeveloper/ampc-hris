import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EducationRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { Education } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedEducationUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION)
    private readonly educationRepository: EducationRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    employee_id: number,
  ): Promise<PaginatedResult<Education>> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const educations = await this.educationRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          employee_id,
          manager,
        );
        return educations;
      },
    );
  }
}
