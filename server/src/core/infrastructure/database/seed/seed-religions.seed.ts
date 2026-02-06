import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ReligionEntity } from '@/features/201-management/infrastructure/database/entities/religion.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { RELIGIONS } from './data';

export class SeedReligions {
  private readonly logger = new Logger(SeedReligions.name);

  constructor(private readonly entityManager: EntityManager) { }

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of RELIGIONS) {
      const existing = await this.entityManager.findOne(ReligionEntity, {
        where: { desc1 },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(ReligionEntity, {
          desc1,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created religion: ${desc1}`);
      }
    }
  }
}
