import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ProvinceEntity } from '@/features/201-management/infrastructure/database/entities/province.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { PROVINCES } from './data';

export class SeedProvinces {
  private readonly logger = new Logger(SeedProvinces.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of PROVINCES) {
      const existing = await this.entityManager.findOne(ProvinceEntity, {
        where: { desc1 },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(ProvinceEntity, {
          desc1,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created province: ${desc1}`);
      }
    }
  }
}
