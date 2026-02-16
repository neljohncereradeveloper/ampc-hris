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
  async create(
    leave_type: LeaveType,
    manager: EntityManager,
  ): Promise<LeaveType> {
    const query = `
      INSERT INTO ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES} (
        name, code, desc1, paid, remarks,
        deleted_by, deleted_at,
        created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const result = await manager.query(query, [
      leave_type.name,
      leave_type.code,
      leave_type.desc1,
      leave_type.paid,
      leave_type.remarks ?? null,
      leave_type.deleted_by,
      leave_type.deleted_at,
      leave_type.created_by,
      leave_type.created_at,
      leave_type.updated_by,
      leave_type.updated_at,
    ]);

    const saved_entity = result[0];
    return this.entityToModel(saved_entity);
  }

  async update(
    id: number,
    dto: Partial<LeaveType>,
    manager: EntityManager,
  ): Promise<boolean> {
    const update_fields: string[] = [];
    const values: unknown[] = [];
    let param_index = 1;

    if (dto.name !== undefined) {
      update_fields.push(`name = $${param_index++}`);
      values.push(dto.name);
    }
    if (dto.code !== undefined) {
      update_fields.push(`code = $${param_index++}`);
      values.push(dto.code);
    }
    if (dto.desc1 !== undefined) {
      update_fields.push(`desc1 = $${param_index++}`);
      values.push(dto.desc1);
    }
    if (dto.paid !== undefined) {
      update_fields.push(`paid = $${param_index++}`);
      values.push(dto.paid);
    }
    if (dto.remarks !== undefined) {
      update_fields.push(`remarks = $${param_index++}`);
      values.push(dto.remarks);
    }
    if (dto.deleted_by !== undefined) {
      update_fields.push(`deleted_by = $${param_index++}`);
      values.push(dto.deleted_by);
    }
    if (dto.deleted_at !== undefined) {
      update_fields.push(`deleted_at = $${param_index++}`);
      values.push(dto.deleted_at);
    }
    if (dto.updated_by !== undefined) {
      update_fields.push(`updated_by = $${param_index++}`);
      values.push(dto.updated_by);
    }
    if (dto.updated_at !== undefined) {
      update_fields.push(`updated_at = $${param_index++}`);
      values.push(dto.updated_at);
    }

    if (update_fields.length === 0) {
      return false;
    }

    values.push(id);

    const is_archive_or_restore =
      dto.deleted_at !== undefined || dto.deleted_by !== undefined;
    const where_clause = is_archive_or_restore
      ? `WHERE id = $${param_index}`
      : `WHERE id = $${param_index} AND deleted_at IS NULL`;

    const query = `
      UPDATE ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      SET ${update_fields.join(', ')}
      ${where_clause}
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async findById(
    id: number,
    manager: EntityManager,
  ): Promise<LeaveType | null> {
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

  async findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    manager: EntityManager,
  ): Promise<PaginatedResult<LeaveType>> {
    const offset = (page - 1) * limit;
    const search_term = term ? `%${term}%` : '%';

    let where_clause = '';
    const query_params: unknown[] = [];
    let param_index = 1;

    if (is_archived) {
      where_clause = 'WHERE deleted_at IS NOT NULL';
    } else {
      where_clause = 'WHERE deleted_at IS NULL';
    }

    if (term) {
      where_clause += ` AND (name ILIKE $${param_index} OR code ILIKE $${param_index} OR desc1 ILIKE $${param_index})`;
      query_params.push(search_term);
      param_index++;
    }

    const count_query = `
      SELECT COUNT(*) as total
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      ${where_clause}
    `;

    const count_result = await manager.query(count_query, query_params);
    const total_records = parseInt(count_result[0].total, 10);

    const data_query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      ${where_clause}
      ORDER BY name ASC, created_at DESC
      LIMIT $${param_index} OFFSET $${param_index + 1}
    `;

    query_params.push(limit, offset);
    const data_result = await manager.query(data_query, query_params);

    const leave_types = data_result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: leave_types,
      meta: calculatePagination(total_records, page, limit),
    };
  }

  async combobox(manager: EntityManager): Promise<LeaveType[]> {
    const query = `
      SELECT id, name, code, desc1, paid, remarks,
        deleted_by, deleted_at, created_by, created_at, updated_by, updated_at
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
    return new LeaveType({
      id: entity.id as number,
      name: (entity.name as string) ?? (entity.desc1 as string) ?? '',
      code: (entity.code as string) ?? '',
      desc1: entity.desc1 as string,
      paid: entity.paid !== undefined ? (entity.paid as boolean) : true,
      remarks: (entity.remarks as string) ?? undefined,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
