import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { WorkExperienceCompanyRepository } from '@/features/201-management/domain/repositories';
import {
  WORK_EXPERIENCE_COMPANY_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxWorkExperienceCompanyUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_COMPANY)
    private readonly workExperienceCompanyRepository: WorkExperienceCompanyRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_COMPANY_ACTIONS.COMBOBOX,
      async (manager) => {
        const work_experience_companies =
          await this.workExperienceCompanyRepository.combobox(manager);
        return work_experience_companies.map(
          (work_experience_company: { desc1: string }) => ({
            value: work_experience_company.desc1 || '',
            label: work_experience_company.desc1
              ? work_experience_company.desc1.charAt(0).toUpperCase() +
                work_experience_company.desc1.slice(1).toLowerCase()
              : '',
          }),
        );
      },
    );
  }
}
