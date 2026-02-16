import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { WorkExperienceCompanyRepository } from '@/features/201-management/domain/repositories';
import {
  WORK_EXPERIENCE_COMPANY_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { WorkExperienceCompany } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedWorkExperienceCompanyUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_COMPANY)
    private readonly workExperienceCompanyRepository: WorkExperienceCompanyRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<WorkExperienceCompany>> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_COMPANY_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const work_experience_companies =
          await this.workExperienceCompanyRepository.findPaginatedList(
            term,
            page,
            limit,
            is_archived,
            manager,
          );
        return work_experience_companies;
      },
    );
  }
}
