import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EducationLevelRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_LEVEL_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationLevel } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedEducationLevelUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_LEVEL)
    private readonly educationLevelRepository: EducationLevelRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<EducationLevel>> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_LEVEL_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const education_levels =
          await this.educationLevelRepository.findPaginatedList(
            term,
            page,
            limit,
            is_archived,
            manager,
          );
        return education_levels;
      },
    );
  }
}
