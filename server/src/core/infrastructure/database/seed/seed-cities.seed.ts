import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { CityEntity } from '@/features/201-management/infrastructure/database/entities/city.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { CITIES } from './data';

export class SeedCities {
  private readonly logger = new Logger(SeedCities.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of CITIES) {
      const existing = await this.entityManager.findOne(CityEntity, {
        where: { desc1 },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(CityEntity, {
          desc1,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created city: ${desc1}`);
      }
    }
  }
}
