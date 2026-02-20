import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LeaveTypeRepository } from '@/features/shared-domain/domain/repositories';
import { LeaveType } from '@/features/shared-domain/domain/models';
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';

@Injectable()
export class LeaveTypeRepositoryImpl implements LeaveTypeRepository<EntityManager> {
  async create(leave_type: LeaveType, manager: EntityManager): Promise<LeaveType> {
    const query = `
      INSERT INTO ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES} (
        name, code, desc1, paid, remarks, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await manager.query(query, [
      leave_type.name,
      leave_type.code,
      leave_type.desc1,
      leave_type.paid,
      leave_type.remarks ?? null,
      leave_type.created_by,
    ]);

    return this.entityToModel(result[0]);
  }

  async update(
    id: number,
    dto: Partial<LeaveType>,
    manager: EntityManager,
  ): Promise<boolean> {
    const update_fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.name !== undefined) {
      update_fields.push(`name = $${paramIndex++}`);
      values.push(dto.name);
    }
    if (dto.code !== undefined) {
      update_fields.push(`code = $${paramIndex++}`);
      values.push(dto.code);
    }
    if (dto.desc1 !== undefined) {
      update_fields.push(`desc1 = $${paramIndex++}`);
      values.push(dto.desc1);
    }
    if (dto.paid !== undefined) {
      update_fields.push(`paid = $${paramIndex++}`);
      values.push(dto.paid);
    }
    if (dto.remarks !== undefined) {
      update_fields.push(`remarks = $${paramIndex++}`);
      values.push(dto.remarks);
    }
    if (dto.deleted_by !== undefined) {
      update_fields.push(`deleted_by = $${paramIndex++}`);
      values.push(dto.deleted_by);
    }
    if (dto.deleted_at !== undefined) {
      update_fields.push(`deleted_at = $${paramIndex++}`);
      values.push(dto.deleted_at);
    }
    if (dto.updated_by !== undefined) {
      update_fields.push(`updated_by = $${paramIndex++}`);
      values.push(dto.updated_by);
    }
    if (dto.updated_at !== undefined) {
      update_fields.push(`updated_at = $${paramIndex++}`);
      values.push(dto.updated_at);
    }

    if (update_fields.length === 0) {
      return false;
    }

    values.push(id);

    const query = `
      UPDATE ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      SET ${update_fields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  /**
   * Finds a leave type by ID regardless of archived status.
   * Used internally for archive/restore operations.
   */
  async findById(id: number, manager: EntityManager): Promise<LeaveType | null> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
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
  ): Promise<LeaveType | null> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      WHERE desc1 = $1 AND deleted_at IS NULL
    `;

    const result = await manager.query(query, [description]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findByName(
    name: string,
    manager: EntityManager,
  ): Promise<LeaveType | null> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      WHERE name = $1 AND deleted_at IS NULL
    `;

    const result = await manager.query(query, [name]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findByCode(
    code: string,
    manager: EntityManager,
  ): Promise<LeaveType | null> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      WHERE code = $1 AND deleted_at IS NULL
    `;

    const result = await manager.query(query, [code]);
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
  ): Promise<PaginatedResult<LeaveType>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';

    const queryParams: unknown[] = [];
    let paramIndex = 1;

    let whereClause = is_archived
      ? 'WHERE deleted_at IS NOT NULL'
      : 'WHERE deleted_at IS NULL';

    if (term) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR code ILIKE $${paramIndex} OR desc1 ILIKE $${paramIndex})`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    const dataQuery = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      ${whereClause}
      ORDER BY name ASC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const leaveTypes = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: leaveTypes,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  /**
   * Returns a lightweight list of active leave types for use in dropdowns.
   * Selects all user-facing fields to ensure mapping works for comboboxes.
   */
  async combobox(manager: EntityManager): Promise<LeaveType[]> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      WHERE deleted_at IS NULL
      ORDER BY name ASC
    `;

    const result = await manager.query(query);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  private entityToModel(entity: Record<string, unknown>): LeaveType {
    return LeaveType.fromPersistence(entity);
  }
}
