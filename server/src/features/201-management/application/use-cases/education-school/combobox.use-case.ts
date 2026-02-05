import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EducationSchoolRepository } from '@/features/201-management/domain/repositories';
import {
  EDUCATION_SCHOOL_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxEducationSchoolUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION_SCHOOL)
    private readonly educationSchoolRepository: EducationSchoolRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_SCHOOL_ACTIONS.COMBOBOX,
      async (manager) => {
        const education_schools =
          await this.educationSchoolRepository.combobox(manager);
        return education_schools.map((education_school: { desc1: string }) => ({
          value: education_school.desc1 || '',
          label: education_school.desc1
            ? education_school.desc1.charAt(0).toUpperCase() +
              education_school.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
