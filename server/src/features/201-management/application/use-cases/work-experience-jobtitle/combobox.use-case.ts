import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { WorkExperienceJobTitleRepository } from '@/features/201-management/domain/repositories';
import {
  WORK_EXPERIENCE_JOBTITLE_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxWorkExperienceJobTitleUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.WORK_EXPERIENCE_JOBTITLE)
    private readonly workExperienceJobTitleRepository: WorkExperienceJobTitleRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      WORK_EXPERIENCE_JOBTITLE_ACTIONS.COMBOBOX,
      async (manager) => {
        const work_experience_job_titles =
          await this.workExperienceJobTitleRepository.combobox(manager);
        return work_experience_job_titles.map(
          (work_experience_job_title: { desc1: string }) => ({
            value: work_experience_job_title.desc1 || '',
            label: work_experience_job_title.desc1
              ? work_experience_job_title.desc1.charAt(0).toUpperCase() +
                work_experience_job_title.desc1.slice(1).toLowerCase()
              : '',
          }),
        );
      },
    );
  }
}
