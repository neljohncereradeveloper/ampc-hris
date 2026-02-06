import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EducationRepository } from '@/features/201-management/domain/repositories';
import { Education } from '@/features/201-management/domain/models';
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';

@Injectable()
export class EducationRepositoryImpl implements EducationRepository<EntityManager> {
  async create(
    education: Education,
    manager: EntityManager,
  ): Promise<Education> {
    const query = `
      INSERT INTO ${MANAGEMENT_201_DATABASE_MODELS.EDUCATIONS} (
        employee_id, education_school_id, education_level_id,
        education_course_id, education_course_level_id,
        school_year,
        deleted_by, deleted_at,
        created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await manager.query(query, [
      education.employee_id,
      education.education_school_id,
      education.education_level_id,
      education.education_course_id ?? null,
      education.education_course_level_id ?? null,
      education.school_year,
      education.deleted_by,
      education.deleted_at,
      education.created_by,
      education.created_at,
      education.updated_by,
      education.updated_at,
    ]);


    const savedEntity = result[0];
    const found = await this.findById(savedEntity.id, manager);
    return found ?? this.entityToModel(savedEntity);
  }

  async update(
    id: number,
    dto: Partial<Education>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.employee_id !== undefined) {
      updateFields.push(`employee_id = $${paramIndex++}`);
      values.push(dto.employee_id);
    }
    if (dto.education_school_id !== undefined) {
      updateFields.push(`education_school_id = $${paramIndex++}`);
      values.push(dto.education_school_id);
    }
    if (dto.education_level_id !== undefined) {
      updateFields.push(`education_level_id = $${paramIndex++}`);
      values.push(dto.education_level_id);
    }
    if (dto.education_course_id !== undefined) {
      updateFields.push(`education_course_id = $${paramIndex++}`);
      values.push(dto.education_course_id);
    }
    if (dto.education_course_level_id !== undefined) {
      updateFields.push(`education_course_level_id = $${paramIndex++}`);
      values.push(dto.education_course_level_id);
    }
    if (dto.school_year !== undefined) {
      updateFields.push(`school_year = $${paramIndex++}`);
      values.push(dto.school_year);
    }
    if (dto.deleted_by !== undefined) {
      updateFields.push(`deleted_by = $${paramIndex++}`);
      values.push(dto.deleted_by);
    }
    if (dto.deleted_at !== undefined) {
      updateFields.push(`deleted_at = $${paramIndex++}`);
      values.push(dto.deleted_at);
    }
    if (dto.updated_by !== undefined) {
      updateFields.push(`updated_by = $${paramIndex++}`);
      values.push(dto.updated_by);
    }

    if (updateFields.length === 0) {
      return false;
    }

    values.push(id);

    const query = `
      UPDATE ${MANAGEMENT_201_DATABASE_MODELS.EDUCATIONS}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async findById(
    id: number,
    manager: EntityManager,
  ): Promise<Education | null> {
    const query = `
      SELECT e.*,
        es.desc1 AS education_school,
        el.desc1 AS education_level,
        ec.desc1 AS education_course,
        ecl.desc1 AS education_course_level
      FROM ${MANAGEMENT_201_DATABASE_MODELS.EDUCATIONS} e
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.EDUCATION_SCHOOLS} es ON e.education_school_id = es.id
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.EDUCATION_LEVELS} el ON e.education_level_id = el.id
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.EDUCATION_COURSES} ec ON e.education_course_id = ec.id
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.EDUCATION_COURSE_LEVELS} ecl ON e.education_course_level_id = ecl.id
      WHERE e.id = $1
    `;

    const result = await manager.query(query, [id]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findEmployeesEducation(
    employee_id: number,
    is_archived: boolean,
    manager: EntityManager,
  ): Promise<{ data: Education[] }> {
    const whereClause = is_archived
      ? 'WHERE employee_id = $1 AND deleted_at IS NOT NULL'
      : 'WHERE employee_id = $1 AND deleted_at IS NULL';

    const query = `
      SELECT e.*,
        es.desc1 AS education_school,
        el.desc1 AS education_level,
        ec.desc1 AS education_course,
        ecl.desc1 AS education_course_level
      FROM ${MANAGEMENT_201_DATABASE_MODELS.EDUCATIONS} e
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.EDUCATION_SCHOOLS} es ON e.education_school_id = es.id
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.EDUCATION_LEVELS} el ON e.education_level_id = el.id
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.EDUCATION_COURSES} ec ON e.education_course_id = ec.id
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.EDUCATION_COURSE_LEVELS} ecl ON e.education_course_level_id = ecl.id
      ${whereClause.replace('employee_id', 'e.employee_id').replace('deleted_at', 'e.deleted_at')}
      ORDER BY e.school_year DESC
    `;

    const result = await manager.query(query, [employee_id]);
    const data = result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return { data };
  }

  private entityToModel(entity: Record<string, unknown>): Education {
    return new Education({
      id: entity.id as number,
      employee_id: entity.employee_id as number,
      education_school_id: entity.education_school_id as number,
      education_school: (entity.education_school as string) ?? undefined,
      education_level_id: entity.education_level_id as number,
      education_level: (entity.education_level as string) ?? undefined,
      education_course_id: (entity.education_course_id as number) ?? undefined,
      education_course: (entity.education_course as string) ?? undefined,
      education_course_level_id:
        (entity.education_course_level_id as number) ?? undefined,
      education_course_level:
        (entity.education_course_level as string) ?? undefined,
      school_year: entity.school_year as string,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
