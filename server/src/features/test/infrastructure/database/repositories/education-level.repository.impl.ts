import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EducationLevelRepository } from '@/features/test/domain/repositories';
import { EducationLevel } from '@/features/test/domain/models';
import { TEST_DATABASE_MODELS } from '@/features/test/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';

@Injectable()
export class EducationLevelRepositoryImpl implements EducationLevelRepository<EntityManager> {
  async create(
    education_level: EducationLevel,
    manager: EntityManager,
  ): Promise<EducationLevel> {
    const query = `
    INSERT INTO ${TEST_DATABASE_MODELS.EDUCATION_LEVELS} (
      desc1, created_by
    )
    VALUES ($1, $2)
    RETURNING *
  `;

    const result = await manager.query(query, [
      education_level.desc1,
      education_level.created_by,
    ]);

    return this.entityToModel(result[0]);
  }

  async update(
    id: number,
    dto: Partial<EducationLevel>,
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

    values.push(id);

    const query = `
      UPDATE ${TEST_DATABASE_MODELS.EDUCATION_LEVELS} }
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  /**
   * Finds a job title by ID regardless of archived status.
   * Used internally for archive/restore operations.
   */
  async findById(
    id: number,
    manager: EntityManager,
  ): Promise<EducationLevel | null> {
    const query = `
      SELECT *
      FROM ${TEST_DATABASE_MODELS.EDUCATION_LEVELS} }
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
  ): Promise<EducationLevel | null> {
    const query = `
      SELECT *
      FROM ${TEST_DATABASE_MODELS.EDUCATION_LEVELS} }
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
  ): Promise<PaginatedResult<EducationLevel>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';

    const queryParams: unknown[] = [];
    let paramIndex = 1;

    let whereClause = is_archived
      ? 'WHERE deleted_at IS NOT NULL'
      : 'WHERE deleted_at IS NULL';

    if (term) {
      whereClause += ` AND desc1 ILIKE $${paramIndex++}`;
      queryParams.push(searchTerm);
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${TEST_DATABASE_MODELS.EDUCATION_LEVELS} }
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    const dataQuery = `
      SELECT *
      FROM ${TEST_DATABASE_MODELS.EDUCATION_LEVELS} }
      ${whereClause}
      ORDER BY desc1 ASC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const education_levels = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: education_levels,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  /**
   * Returns a lightweight list of active job titles for use in dropdowns.
   * Selects all fields to ensure `fromPersistence()` maps correctly.
   */
  async combobox(manager: EntityManager): Promise<EducationLevel[]> {
    const query = `
      SELECT *
      FROM ${TEST_DATABASE_MODELS.EDUCATION_LEVELS} }
      WHERE deleted_at IS NULL
      ORDER BY desc1 ASC
    `;

    const result = await manager.query(query);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  private entityToModel(entity: Record<string, unknown>): EducationLevel {
    return EducationLevel.fromPersistence(entity);
  }
}
