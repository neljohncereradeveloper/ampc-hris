import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { JobtitleEntity } from '@/features/shared-domain/infrastructure/database/entities/jobtitle.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { JOB_TITLES } from './data';

export class SeedJobTitles {
  private readonly logger = new Logger(SeedJobTitles.name);

  constructor(private readonly entityManager: EntityManager) { }

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of JOB_TITLES) {
      const existing = await this.entityManager.findOne(JobtitleEntity, {
        where: { desc1 },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(JobtitleEntity, {
          desc1,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created job title: ${desc1}`);
      }
    }
  }
}
