import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EducationCourseLevelRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_COURSE_LEVEL_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationCourseLevel } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedEducationCourseLevelUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_COURSE_LEVEL)
    private readonly educationCourseLevelRepository: EducationCourseLevelRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<EducationCourseLevel>> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_LEVEL_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const education_course_levels =
          await this.educationCourseLevelRepository.findPaginatedList(
            term,
            page,
            limit,
            is_archived,
            manager,
          );
        return education_course_levels;
      },
    );
  }
}
