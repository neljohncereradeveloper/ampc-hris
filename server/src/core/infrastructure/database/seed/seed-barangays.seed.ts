import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { BarangayEntity } from '@/features/201-management/infrastructure/database/entities/barangay.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { BARANGAYS } from './data';

export class SeedBarangays {
  private readonly logger = new Logger(SeedBarangays.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of BARANGAYS) {
      const existing = await this.entityManager.findOne(BarangayEntity, {
        where: { desc1 },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(BarangayEntity, {
          desc1,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created barangay: ${desc1}`);
      }
    }
  }
}
