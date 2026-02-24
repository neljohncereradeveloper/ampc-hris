import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { CitizenshipEntity } from '@/features/201-management/infrastructure/database/entities/citizenship.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { CITIZENSHIPS } from './data';
import { toLowerCaseString } from '@/core/utils/coercion.util';

export class SeedCitizenships {
  private readonly logger = new Logger(SeedCitizenships.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of CITIZENSHIPS) {
      const existing = await this.entityManager.findOne(CitizenshipEntity, {
        where: { desc1: toLowerCaseString(desc1) },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(CitizenshipEntity, {
          desc1: toLowerCaseString(desc1)!,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created citizenship: ${toLowerCaseString(desc1)!}`);
      }
    }
  }
}
