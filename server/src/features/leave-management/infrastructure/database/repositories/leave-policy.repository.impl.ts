import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LeavePolicyRepository } from '@/features/leave-management/domain/repositories/leave-policy.repository';
import { LeavePolicy } from '@/features/leave-management/domain/models/leave-policy.model';
import { LEAVE_MANAGEMENT_DATABASE_MODELS } from '@/features/leave-management/domain/constants';
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';

const LP = LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES;
const LT = SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES;
import { PaginatedResult, calculatePagination } from '@/core/utils/pagination.util';
import { EnumLeavePolicyStatus } from '@/features/leave-management/domain/enum';

function parseDecimal(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

function parseJsonArray(value: unknown): string[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string') {
    try {
      const arr = JSON.parse(value);
      return Array.isArray(arr) ? arr : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function parseJsonNumberArray(value: unknown): number[] | undefined {
  if (value == null) return undefined;
  if (Array.isArray(value)) return value as number[];
  if (typeof value === 'string') {
    try {
      const arr = JSON.parse(value);
      return Array.isArray(arr) ? arr : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

@Injectable()
export class LeavePolicyRepositoryImpl implements LeavePolicyRepository<EntityManager> {
  async create(leave_policy: LeavePolicy, manager: EntityManager): Promise<LeavePolicy> {
    const query = `
      INSERT INTO ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES} (
        leave_type_id, annual_entitlement, carry_limit, encash_limit,
        carried_over_years, effective_date, expiry_date, status, remarks,
        minimum_service_months, allowed_employment_types, allowed_employee_statuses, excluded_weekdays,
        deleted_by, deleted_at, created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;
    const result = await manager.query(query, [
      leave_policy.leave_type_id,
      leave_policy.annual_entitlement,
      leave_policy.carry_limit,
      leave_policy.encash_limit,
      leave_policy.carried_over_years,
      leave_policy.effective_date ?? null,
      leave_policy.expiry_date ?? null,
      leave_policy.status,
      leave_policy.remarks ?? null,
      leave_policy.minimum_service_months ?? null,
      leave_policy.allowed_employment_types ? JSON.stringify(leave_policy.allowed_employment_types) : null,
      leave_policy.allowed_employee_statuses ? JSON.stringify(leave_policy.allowed_employee_statuses) : null,
      leave_policy.excluded_weekdays ? JSON.stringify(leave_policy.excluded_weekdays) : null,
      leave_policy.deleted_by ?? null,
      leave_policy.deleted_at ?? null,
      leave_policy.created_by ?? null,
      leave_policy.created_at ?? new Date(),
      leave_policy.updated_by ?? null,
      leave_policy.updated_at ?? new Date(),
    ]);
    return this.entityToModel(result[0]);
  }

  async update(id: number, dto: Partial<LeavePolicy>, manager: EntityManager): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;
    if (dto.annual_entitlement !== undefined) {
      updateFields.push(`annual_entitlement = $${paramIndex++}`);
      values.push(dto.annual_entitlement);
    }
    if (dto.carry_limit !== undefined) {
      updateFields.push(`carry_limit = $${paramIndex++}`);
      values.push(dto.carry_limit);
    }
    if (dto.encash_limit !== undefined) {
      updateFields.push(`encash_limit = $${paramIndex++}`);
      values.push(dto.encash_limit);
    }
    if (dto.carried_over_years !== undefined) {
      updateFields.push(`carried_over_years = $${paramIndex++}`);
      values.push(dto.carried_over_years);
    }
    if (dto.effective_date !== undefined) {
      updateFields.push(`effective_date = $${paramIndex++}`);
      values.push(dto.effective_date);
    }
    if (dto.expiry_date !== undefined) {
      updateFields.push(`expiry_date = $${paramIndex++}`);
      values.push(dto.expiry_date);
    }
    if (dto.status !== undefined) {
      updateFields.push(`status = $${paramIndex++}`);
      values.push(dto.status);
    }
    if (dto.remarks !== undefined) {
      updateFields.push(`remarks = $${paramIndex++}`);
      values.push(dto.remarks);
    }
    if (dto.minimum_service_months !== undefined) {
      updateFields.push(`minimum_service_months = $${paramIndex++}`);
      values.push(dto.minimum_service_months);
    }
    if (dto.allowed_employment_types !== undefined) {
      updateFields.push(`allowed_employment_types = $${paramIndex++}`);
      values.push(JSON.stringify(dto.allowed_employment_types));
    }
    if (dto.allowed_employee_statuses !== undefined) {
      updateFields.push(`allowed_employee_statuses = $${paramIndex++}`);
      values.push(JSON.stringify(dto.allowed_employee_statuses));
    }
    if (dto.excluded_weekdays !== undefined) {
      updateFields.push(`excluded_weekdays = $${paramIndex++}`);
      values.push(JSON.stringify(dto.excluded_weekdays));
    }
    if (dto.updated_by !== undefined) {
      updateFields.push(`updated_by = $${paramIndex++}`);
      values.push(dto.updated_by);
    }
    if (updateFields.length === 0) return false;
    updateFields.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());
    values.push(id);
    const query = `
      UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;
    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async findById(id: number, manager: EntityManager): Promise<LeavePolicy | null> {
    const query = `
      SELECT lp.*, lt.name AS leave_type_name
      FROM ${LP} lp
      LEFT JOIN ${LT} lt ON lp.leave_type_id = lt.id AND lt.deleted_at IS NULL
      WHERE lp.id = $1
    `;
    const result = await manager.query(query, [id]);
    if (result.length === 0) return null;
    return this.entityToModel(result[0]);
  }

  async findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    manager: EntityManager,
  ): Promise<PaginatedResult<LeavePolicy>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';
    const whereArchived = is_archived ? 'deleted_at IS NOT NULL' : 'deleted_at IS NULL';
    const queryParams: unknown[] = term ? [searchTerm, limit, offset] : [limit, offset];
    const joinClause = `
      FROM ${LP} lp
      LEFT JOIN ${LT} lt ON lp.leave_type_id = lt.id AND lt.deleted_at IS NULL
    `;
    const countQuery = `
      SELECT COUNT(*) as total ${joinClause}
      WHERE lp.deleted_at ${is_archived ? 'IS NOT NULL' : 'IS NULL'}${term ? ' AND (lp.remarks ILIKE $1 OR lt.name ILIKE $1)' : ''}
    `;
    const countResult = await manager.query(countQuery, term ? [searchTerm] : []);
    const totalRecords = parseInt(countResult[0].total, 10);
    const paramIndex = term ? 2 : 1;
    const dataQuery = `
      SELECT lp.*, lt.name AS leave_type_name
      ${joinClause}
      WHERE lp.deleted_at ${is_archived ? 'IS NOT NULL' : 'IS NULL'}${term ? ' AND (lp.remarks ILIKE $1 OR lt.name ILIKE $1)' : ''}
      ORDER BY lp.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await manager.query(dataQuery, queryParams);
    const data = dataResult.map((row: Record<string, unknown>) => this.entityToModel(row));
    return { data, meta: calculatePagination(totalRecords, page, limit) };
  }

  async retrieveActivePolicies(manager: EntityManager): Promise<LeavePolicy[]> {
    const query = `
      SELECT lp.*, lt.name AS leave_type_name
      FROM ${LP} lp
      LEFT JOIN ${LT} lt ON lp.leave_type_id = lt.id AND lt.deleted_at IS NULL
      WHERE lp.status = $1 AND lp.deleted_at IS NULL
      ORDER BY lp.leave_type_id
    `;
    const result = await manager.query(query, [EnumLeavePolicyStatus.ACTIVE]);
    return result.map((row: Record<string, unknown>) => this.entityToModel(row));
  }

  async getActivePolicy(leave_type_id: number, manager: EntityManager): Promise<LeavePolicy | null> {
    const query = `
      SELECT lp.*, lt.name AS leave_type_name
      FROM ${LP} lp
      LEFT JOIN ${LT} lt ON lp.leave_type_id = lt.id AND lt.deleted_at IS NULL
      WHERE lp.leave_type_id = $1 AND lp.status = $2 AND lp.deleted_at IS NULL
    `;
    const result = await manager.query(query, [leave_type_id, EnumLeavePolicyStatus.ACTIVE]);
    if (result.length === 0) return null;
    return this.entityToModel(result[0]);
  }

  async activatePolicy(id: number, manager: EntityManager): Promise<boolean> {
    const query = `
      UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES}
      SET status = $1, updated_at = $2 WHERE id = $3 AND deleted_at IS NULL RETURNING id
    `;
    const result = await manager.query(query, [EnumLeavePolicyStatus.ACTIVE, new Date(), id]);
    return result.length > 0;
  }

  async retirePolicy(id: number, manager: EntityManager, expiry_date?: Date): Promise<boolean> {
    if (expiry_date) {
      const query = `
        UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES}
        SET status = $1, expiry_date = $2, updated_at = $3 WHERE id = $4 AND deleted_at IS NULL RETURNING id
      `;
      const result = await manager.query(query, [EnumLeavePolicyStatus.RETIRED, expiry_date, new Date(), id]);
      return result.length > 0;
    }
    const query = `
      UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES}
      SET status = $1, updated_at = $2 WHERE id = $3 AND deleted_at IS NULL RETURNING id
    `;
    const result = await manager.query(query, [EnumLeavePolicyStatus.RETIRED, new Date(), id]);
    return result.length > 0;
  }

  private entityToModel(entity: Record<string, unknown>): LeavePolicy {
    return new LeavePolicy({
      id: entity.id as number,
      leave_type_id: entity.leave_type_id as number,
      leave_type: (entity.leave_type_name as string) ?? undefined,
      annual_entitlement: parseDecimal(entity.annual_entitlement),
      carry_limit: parseDecimal(entity.carry_limit),
      encash_limit: parseDecimal(entity.encash_limit),
      carried_over_years: (entity.carried_over_years as number) ?? 0,
      effective_date: (entity.effective_date as Date) ?? undefined,
      expiry_date: (entity.expiry_date as Date) ?? undefined,
      status: entity.status as EnumLeavePolicyStatus,
      remarks: (entity.remarks as string) ?? undefined,
      minimum_service_months: (entity.minimum_service_months as number) ?? undefined,
      allowed_employment_types: parseJsonArray(entity.allowed_employment_types),
      allowed_employee_statuses: parseJsonArray(entity.allowed_employee_statuses),
      excluded_weekdays: parseJsonNumberArray(entity.excluded_weekdays),
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
