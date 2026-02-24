import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { DepartmentEntity } from '@/features/shared-domain/infrastructure/database/entities/department.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { DEPARTMENTS } from './data';
import { toLowerCaseString } from '@/core/utils/coercion.util';

export class SeedDepartments {
  private readonly logger = new Logger(SeedDepartments.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const { desc1, code, designation } of DEPARTMENTS) {
      const existing = await this.entityManager.findOne(DepartmentEntity, {
        where: { desc1: toLowerCaseString(desc1) },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(DepartmentEntity, {
          desc1: toLowerCaseString(desc1)!,
          code,
          designation,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created department: ${toLowerCaseString(desc1)!}`);
      }
    }
  }
}
