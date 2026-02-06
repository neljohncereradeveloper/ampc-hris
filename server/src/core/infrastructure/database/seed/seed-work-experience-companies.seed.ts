import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { WorkExperienceCompanyEntity } from '@/features/201-management/infrastructure/database/entities/work-experience-company.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { WORK_EXPERIENCE_COMPANIES } from './data';

export class SeedWorkExperienceCompanies {
  private readonly logger = new Logger(SeedWorkExperienceCompanies.name);

  constructor(private readonly entityManager: EntityManager) { }

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of WORK_EXPERIENCE_COMPANIES) {
      const existing = await this.entityManager.findOne(
        WorkExperienceCompanyEntity,
        {
          where: { desc1 },
          withDeleted: true,
        },
      );
      if (!existing) {
        const entity = this.entityManager.create(WorkExperienceCompanyEntity, {
          desc1,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created work experience company: ${desc1}`);
      }
    }
  }
}
