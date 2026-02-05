import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { WorkExperienceCompanyRepository } from '@/features/201-management/domain/repositories';
import { WorkExperienceCompany } from '@/features/201-management/domain/models';
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class WorkExperienceCompanyRepositoryImpl
  implements WorkExperienceCompanyRepository<EntityManager> {
  async create(
    work_experience_company: WorkExperienceCompany,
    manager: EntityManager,
  ): Promise<WorkExperienceCompany> {
    const query = `
      INSERT INTO ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_COMPANIES} (
        desc1, deleted_by, deleted_at,
        created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await manager.query(query, [
      work_experience_company.desc1,
      work_experience_company.deleted_by,
      work_experience_company.deleted_at,
      work_experience_company.created_by,
      work_experience_company.created_at,
      work_experience_company.updated_by,
      work_experience_company.updated_at,
    ]);

    const savedEntity = result[0];
    return this.entityToModel(savedEntity);
  }

  async update(
    id: number,
    dto: Partial<WorkExperienceCompany>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.desc1 !== undefined) {
      updateFields.push(`desc1 = $${paramIndex++}`);
      values.push(dto.desc1);
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

    // Always update updated_at when using raw SQL
    updateFields.push(`updated_at = $${paramIndex++}`);
    values.push(getPHDateTime());

    values.push(id);

    const query = `
      UPDATE ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_COMPANIES}
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
  ): Promise<WorkExperienceCompany | null> {
    const query = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_COMPANIES}
      WHERE id = $1
    `;

    const result = await manager.query(query, [id]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findByDescription(
    description: string,
    manager: EntityManager,
  ): Promise<WorkExperienceCompany | null> {
    const query = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_COMPANIES}
      WHERE desc1 = $1 AND deleted_at IS NULL
    `;

    const result = await manager.query(query, [description]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    manager: EntityManager,
  ): Promise<PaginatedResult<WorkExperienceCompany>> {
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

    // Add search term if provided
    if (term) {
      whereClause += ` AND desc1 ILIKE $${paramIndex}`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    // Count total records
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_COMPANIES}
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    // Fetch paginated data
    const dataQuery = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_COMPANIES}
      ${whereClause}
      ORDER BY desc1 ASC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const work_experience_companies = dataResult.map(
      (row: Record<string, unknown>) => this.entityToModel(row),
    );

    return {
      data: work_experience_companies,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  async combobox(
    manager: EntityManager,
  ): Promise<WorkExperienceCompany[]> {
    const query = `
      SELECT id, desc1
      FROM ${MANAGEMENT_201_DATABASE_MODELS.WORK_EXPERIENCE_COMPANIES}
      WHERE deleted_at IS NULL
      ORDER BY desc1 ASC
    `;

    const result = await manager.query(query);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  /**
   * Converts database entity to domain model
   */
  private entityToModel(
    entity: Record<string, unknown>,
  ): WorkExperienceCompany {
    return new WorkExperienceCompany({
      id: entity.id as number,
      desc1: entity.desc1 as string,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
