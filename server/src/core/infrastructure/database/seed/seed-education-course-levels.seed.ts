import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { EducationCourseLevelEntity } from '@/features/201-management/infrastructure/database/entities/education-course-level.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { EDUCATION_COURSE_LEVELS } from './data';

export class SeedEducationCourseLevels {
  private readonly logger = new Logger(SeedEducationCourseLevels.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of EDUCATION_COURSE_LEVELS) {
      const existing = await this.entityManager.findOne(
        EducationCourseLevelEntity,
        {
          where: { desc1 },
          withDeleted: true,
        },
      );
      if (!existing) {
        const entity = this.entityManager.create(EducationCourseLevelEntity, {
          desc1,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created education course level: ${desc1}`);
      }
    }
  }
}
