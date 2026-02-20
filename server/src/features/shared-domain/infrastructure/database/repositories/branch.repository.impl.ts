import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BranchRepository } from '@/features/shared-domain/domain/repositories';
import { Branch } from '@/features/shared-domain/domain/models';
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';

@Injectable()
export class BranchRepositoryImpl implements BranchRepository<EntityManager> {
  async create(branch: Branch, manager: EntityManager): Promise<Branch> {
    const query = `
      INSERT INTO ${SHARED_DOMAIN_DATABASE_MODELS.BRANCHES} (
        desc1, br_code, created_by
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await manager.query(query, [
      branch.desc1,
      branch.br_code,
      branch.created_by,
    ]);

    return this.entityToModel(result[0]);
  }

  async update(
    id: number,
    dto: Partial<Branch>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.desc1 !== undefined) {
      updateFields.push(`desc1 = $${paramIndex++}`);
      values.push(dto.desc1);
    }
    if (dto.br_code !== undefined) {
      updateFields.push(`br_code = $${paramIndex++}`);
      values.push(dto.br_code);
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
      UPDATE ${SHARED_DOMAIN_DATABASE_MODELS.BRANCHES}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  /**
   * Finds a branch by ID regardless of archived status.
   * Used internally for archive/restore operations where we need
   * to fetch the record before performing state transitions.
   */
  async findById(id: number, manager: EntityManager): Promise<Branch | null> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.BRANCHES}
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
  ): Promise<Branch | null> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.BRANCHES}
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
  ): Promise<PaginatedResult<Branch>> {
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
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.BRANCHES}
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    const dataQuery = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.BRANCHES}
      ${whereClause}
      ORDER BY desc1 ASC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const branches = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: branches,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  /**
   * Returns a lightweight list of active branches for use in dropdowns.
   * Selects all fields to ensure `fromPersistence()` maps correctly.
   */
  async combobox(manager: EntityManager): Promise<Branch[]> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.BRANCHES}
      WHERE deleted_at IS NULL
      ORDER BY desc1 ASC
    `;

    const result = await manager.query(query);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  private entityToModel(entity: Record<string, unknown>): Branch {
    return Branch.fromPersistence(entity);
  }
}