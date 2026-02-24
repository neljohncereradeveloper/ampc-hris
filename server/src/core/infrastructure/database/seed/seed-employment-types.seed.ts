import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { EmploymentTypeEntity } from '@/features/201-management/infrastructure/database/entities/employment-type.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { EMPLOYMENT_TYPES } from './data';
import { toLowerCaseString } from '@/core/utils/coercion.util';

export class SeedEmploymentTypes {
  private readonly logger = new Logger(SeedEmploymentTypes.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of EMPLOYMENT_TYPES) {
      const existing = await this.entityManager.findOne(EmploymentTypeEntity, {
        where: { desc1: toLowerCaseString(desc1) },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(EmploymentTypeEntity, {
          desc1: toLowerCaseString(desc1)!,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(
          `Created employment type: ${toLowerCaseString(desc1)!}`,
        );
      }
    }
  }
}
