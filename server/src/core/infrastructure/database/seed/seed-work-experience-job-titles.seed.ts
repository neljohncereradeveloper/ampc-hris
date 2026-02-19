import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { WorkExperienceJobTitleEntity } from '@/features/201-management/infrastructure/database/entities/work-experience-jobtitle.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { WORK_EXPERIENCE_JOB_TITLES } from './data';
import { toLowerCaseString } from '@/core/utils/coercion.util';

export class SeedWorkExperienceJobTitles {
  private readonly logger = new Logger(SeedWorkExperienceJobTitles.name);

  constructor(private readonly entityManager: EntityManager) { }

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of WORK_EXPERIENCE_JOB_TITLES) {
      const existing = await this.entityManager.findOne(
        WorkExperienceJobTitleEntity,
        {
          where: { desc1: toLowerCaseString(desc1) },
          withDeleted: true,
        },
      );
      if (!existing) {
        const entity = this.entityManager.create(WorkExperienceJobTitleEntity, {
          desc1: toLowerCaseString(desc1)!,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created work experience job title: ${toLowerCaseString(desc1)!}`);
      }
    }
  }
}
