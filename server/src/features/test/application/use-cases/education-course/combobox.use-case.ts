import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EducationCourseRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_COURSE_ACTIONS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';

@Injectable()
export class ComboboxEducationCourseUseCase {
  constructor(
    @Inject(TEST_TOKENS.EDUCATION_COURSE)
    private readonly educationCourseRepository: EducationCourseRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_ACTIONS.COMBOBOX,
      async (manager) => {
        const education_courses =
          await this.educationCourseRepository.combobox(manager);
        return education_courses.map((education_course: { desc1: string }) => ({
          value: education_course.desc1 || '',
          label: education_course.desc1
            ? education_course.desc1.charAt(0).toUpperCase() +
              education_course.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
