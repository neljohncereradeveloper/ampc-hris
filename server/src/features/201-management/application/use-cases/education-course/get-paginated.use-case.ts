import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EducationCourseRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_COURSE_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { EducationCourse } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedEducationCourseUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_COURSE)
    private readonly educationCourseRepository: EducationCourseRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<EducationCourse>> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const education_courses =
          await this.educationCourseRepository.findPaginatedList(
            term,
            page,
            limit,
            is_archived,
            manager,
          );
        return education_courses;
      },
    );
  }
}
