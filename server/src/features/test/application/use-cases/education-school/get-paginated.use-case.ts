import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EducationSchoolRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_SCHOOL_ACTIONS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationSchool } from '@/features/test/domain/models';

@Injectable()
export class GetPaginatedEducationSchoolUseCase {
  constructor(
    @Inject(TEST_TOKENS.EDUCATION_SCHOOL)
    private readonly educationSchoolRepository: EducationSchoolRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<EducationSchool>> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_SCHOOL_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const education_schools =
          await this.educationSchoolRepository.findPaginatedList(
            term,
            page,
            limit,
            is_archived,
            manager,
          );
        return education_schools;
      },
    );
  }
}
