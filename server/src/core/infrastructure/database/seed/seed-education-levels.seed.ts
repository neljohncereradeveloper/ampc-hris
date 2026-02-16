import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { EducationLevelEntity } from '@/features/201-management/infrastructure/database/entities/education-level.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { EDUCATION_LEVELS } from './data';

export class SeedEducationLevels {
  private readonly logger = new Logger(SeedEducationLevels.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of EDUCATION_LEVELS) {
      const existing = await this.entityManager.findOne(EducationLevelEntity, {
        where: { desc1 },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(EducationLevelEntity, {
          desc1,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created education level: ${desc1}`);
      }
    }
  }
}
