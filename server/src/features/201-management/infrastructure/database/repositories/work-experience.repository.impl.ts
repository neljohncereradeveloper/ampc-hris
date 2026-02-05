import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WorkExperienceRepository } from '@/features/201-management/domain/repositories';
import { WorkExperience } from '@/features/201-management/domain/models';
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class WorkExperienceRepositoryImpl
  implements WorkExperienceRepository<EntityManager> {
  async create(
    work_experience: WorkExperience,
    manager: EntityManager,
  ): Promise<WorkExperience> {
    const query = `
      INSERT INTO ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCES} (
        employee_id, company_id, company,
        work_experience_job_title_id, work_experience_job_title, years,
        deleted_by, deleted_at,
        created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await manager.query(query, [
      work_experience.employee_id,
      work_experience.company_id,
      work_experience.company,
      work_experience.work_experience_job_title_id,
      work_experience.work_experience_job_title,
      work_experience.years,
      work_experience.deleted_by,
      work_experience.deleted_at,
      work_experience.created_by,
      work_experience.created_at,
      work_experience.updated_by,
      work_experience.updated_at,
    ]);

    const savedEntity = result[0];
    return this.entityToModel(savedEntity);
  }

  async update(
    id: number,
    dto: Partial<WorkExperience>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.employee_id !== undefined) {
      updateFields.push(`employee_id = $${paramIndex++}`);
      values.push(dto.employee_id);
    }
    if (dto.company_id !== undefined) {
      updateFields.push(`company_id = $${paramIndex++}`);
      values.push(dto.company_id);
    }
    if (dto.company !== undefined) {
      updateFields.push(`company = $${paramIndex++}`);
      values.push(dto.company);
    }
    if (dto.work_experience_job_title_id !== undefined) {
      updateFields.push(`work_experience_job_title_id = $${paramIndex++}`);
      values.push(dto.work_experience_job_title_id);
    }
    if (dto.work_experience_job_title !== undefined) {
      updateFields.push(`work_experience_job_title = $${paramIndex++}`);
      values.push(dto.work_experience_job_title);
    }
    if (dto.years !== undefined) {
      updateFields.push(`years = $${paramIndex++}`);
      values.push(dto.years);
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

    // Always update updated_at when any field is updated
    updateFields.push(`updated_at = $${paramIndex++}`);
    values.push(getPHDateTime());

    values.push(id);

    const query = `
      UPDATE ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCES}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async findById(
    id: number,
    manager: EntityManager,
  ): Promise<WorkExperience | null> {
    const query = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCES}
      WHERE id = $1
    `;

    const result = await manager.query(query, [id]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findByEmployeeId(
    employee_id: number,
    manager: EntityManager,
  ): Promise<WorkExperience[]> {
    const query = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCES}
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const result = await manager.query(query, [employee_id]);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  async findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    employee_id: number | null,
    manager: EntityManager,
  ): Promise<PaginatedResult<WorkExperience>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';

    // Build WHERE clause
    let whereClause = '';
    const queryParams: unknown[] = [];
    let paramIndex = 1;

    if (is_archived) {
      whereClause = 'WHERE deleted_at IS NOT NULL';
    } else {
      whereClause = 'WHERE deleted_at IS NULL';
    }

    // Add employee_id filter if provided
    if (employee_id !== null && employee_id !== undefined) {
      whereClause += ` AND employee_id = $${paramIndex}`;
      queryParams.push(employee_id);
      paramIndex++;
    }

    // Add search term if provided
    if (term) {
      whereClause += ` AND (company ILIKE $${paramIndex} OR work_experience_job_title ILIKE $${paramIndex} OR years ILIKE $${paramIndex})`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    // Count total records
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCES}
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    // Fetch paginated data
    const dataQuery = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCES}
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const work_experiences = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: work_experiences,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  /**
   * Converts database entity to domain model
   */
  private entityToModel(entity: Record<string, unknown>): WorkExperience {
    return new WorkExperience({
      id: entity.id as number,
      employee_id: (entity.employee_id as number) ?? null,
      company_id: (entity.company_id as number) ?? null,
      company: (entity.company as string) ?? null,
      work_experience_job_title_id:
        (entity.work_experience_job_title_id as number) ?? null,
      work_experience_job_title:
        (entity.work_experience_job_title as string) ?? null,
      years: (entity.years as string) ?? null,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
