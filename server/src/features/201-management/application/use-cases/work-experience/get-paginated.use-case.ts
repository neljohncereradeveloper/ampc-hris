import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { WorkExperienceRepository } from '@/features/201-management/domain/repositories';
import {
  WORK_EXPERIENCE_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { WorkExperience } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedWorkExperienceUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE)
    private readonly workExperienceRepository: WorkExperienceRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    employee_id: number,
  ): Promise<PaginatedResult<WorkExperience>> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const work_experiences =
          await this.workExperienceRepository.findPaginatedList(
            term,
            page,
            limit,
            is_archived,
            employee_id,
            manager,
          );
        return work_experiences;
      },
    );
  }
}
