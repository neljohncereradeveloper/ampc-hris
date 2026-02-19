import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { EmploymentStatusEntity } from '@/features/201-management/infrastructure/database/entities/employment-status.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { EMPLOYMENT_STATUSES } from './data';
import { toLowerCaseString } from '@/core/utils/coercion.util';

export class SeedEmploymentStatuses {
  private readonly logger = new Logger(SeedEmploymentStatuses.name);

  constructor(private readonly entityManager: EntityManager) { }

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of EMPLOYMENT_STATUSES) {
      const existing = await this.entityManager.findOne(
        EmploymentStatusEntity,
        {
          where: { desc1: toLowerCaseString(desc1) },
          withDeleted: true,
        },
      );
      if (!existing) {
        const entity = this.entityManager.create(EmploymentStatusEntity, {
          desc1: toLowerCaseString(desc1)!,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created employment status: ${toLowerCaseString(desc1)!}`);
      }
    }
  }
}
