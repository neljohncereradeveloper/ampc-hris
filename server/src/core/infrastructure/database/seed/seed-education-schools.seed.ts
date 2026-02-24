import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { EducationSchoolEntity } from '@/features/201-management/infrastructure/database/entities/education-school.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { EDUCATION_SCHOOLS } from './data';
import { toLowerCaseString } from '@/core/utils/coercion.util';

export class SeedEducationSchools {
  private readonly logger = new Logger(SeedEducationSchools.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of EDUCATION_SCHOOLS) {
      const existing = await this.entityManager.findOne(EducationSchoolEntity, {
        where: { desc1: toLowerCaseString(desc1) },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(EducationSchoolEntity, {
          desc1: toLowerCaseString(desc1)!,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(
          `Created education school: ${toLowerCaseString(desc1)!}`,
        );
      }
    }
  }
}
