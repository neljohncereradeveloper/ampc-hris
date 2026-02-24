import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { EducationCourseEntity } from '@/features/201-management/infrastructure/database/entities/education-course.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { EDUCATION_COURSES } from './data';
import { toLowerCaseString } from '@/core/utils/coercion.util';

export class SeedEducationCourses {
  private readonly logger = new Logger(SeedEducationCourses.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of EDUCATION_COURSES) {
      const existing = await this.entityManager.findOne(EducationCourseEntity, {
        where: { desc1: toLowerCaseString(desc1) },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(EducationCourseEntity, {
          desc1: toLowerCaseString(desc1)!,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(
          `Created education course: ${toLowerCaseString(desc1)!}`,
        );
      }
    }
  }
}
