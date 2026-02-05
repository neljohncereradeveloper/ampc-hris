import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EducationCourseLevelRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_COURSE_LEVEL_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxEducationCourseLevelUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_COURSE_LEVEL)
    private readonly educationCourseLevelRepository: EducationCourseLevelRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_COURSE_LEVEL_ACTIONS.COMBOBOX,
      async (manager) => {
        const education_course_levels =
          await this.educationCourseLevelRepository.combobox(manager);
        return education_course_levels.map(
          (education_course_level: { desc1: string }) => ({
            value: education_course_level.desc1 || '',
            label: education_course_level.desc1
              ? education_course_level.desc1.charAt(0).toUpperCase() +
                education_course_level.desc1.slice(1).toLowerCase()
              : '',
          }),
        );
      },
    );
  }
}
