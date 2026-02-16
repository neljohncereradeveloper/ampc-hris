import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { CivilStatusEntity } from '@/features/201-management/infrastructure/database/entities/civil-status.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { CIVIL_STATUSES } from './data';

export class SeedCivilStatuses {
  private readonly logger = new Logger(SeedCivilStatuses.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of CIVIL_STATUSES) {
      const existing = await this.entityManager.findOne(CivilStatusEntity, {
        where: { desc1 },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(CivilStatusEntity, {
          desc1,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created civil status: ${desc1}`);
      }
    }
  }
}
