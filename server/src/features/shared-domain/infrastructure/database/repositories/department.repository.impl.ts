import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { DepartmentRepository } from '@/features/shared-domain/domain/repositories';
import { Department } from '@/features/shared-domain/domain/models';
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';

@Injectable()
export class DepartmentRepositoryImpl implements DepartmentRepository<EntityManager> {
  async create(
    department: Department,
    manager: EntityManager,
  ): Promise<Department> {
    const query = `
      INSERT INTO ${SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS} (
        desc1, code, scope, remarks, created_by
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await manager.query(query, [
      department.desc1,
      department.code,
      department.scope,
      department.remarks ?? null,
      department.created_by,
    ]);
    return this.entityToModel(result[0]);
  }

  async update(
    id: number,
    dto: Partial<Department>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.desc1 !== undefined) {
      updateFields.push(`desc1 = $${paramIndex++}`);
      values.push(dto.desc1);
    }
    if (dto.code !== undefined) {
      updateFields.push(`code = $${paramIndex++}`);
      values.push(dto.code);
    }
    if (dto.scope !== undefined) {
      updateFields.push(`scope = $${paramIndex++}`);
      values.push(dto.scope);
    }
    if (dto.remarks !== undefined) {
      updateFields.push(`remarks = $${paramIndex++}`);
      values.push(dto.remarks ?? null);
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
      UPDATE ${SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  /**
   * Finds a department by ID regardless of archived status.
   * Used internally for archive/restore operations where we need
   * to fetch the record before performing state transitions.
   */
  async findById(
    id: number,
    manager: EntityManager,
  ): Promise<Department | null> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS}
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
  ): Promise<Department | null> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS}
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
  ): Promise<PaginatedResult<Department>> {
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
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS}
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    const dataQuery = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS}
      ${whereClause}
      ORDER BY desc1 ASC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const departments = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: departments,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  /**
   * Returns a lightweight list of active departments for use in dropdowns.
   * Selects all fields to ensure `fromPersistence()` maps correctly.
   */
  async combobox(manager: EntityManager): Promise<Department[]> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS}
      WHERE deleted_at IS NULL
      ORDER BY desc1 ASC
    `;

    const result = await manager.query(query);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  private entityToModel(entity: Record<string, unknown>): Department {
    return Department.fromPersistence(entity);
  }
}
