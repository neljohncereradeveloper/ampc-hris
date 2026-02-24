import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LeavePolicyRepository } from '@/features/leave-management/domain/repositories/leave-policy.repository';
import { LeavePolicy } from '@/features/leave-management/domain/models/leave-policy.model';
import { LEAVE_MANAGEMENT_DATABASE_MODELS } from '@/features/leave-management/domain/constants';
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';

const lp = LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_POLICIES.toLowerCase();
const lt = SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES.toLowerCase();
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';
import {
  parseJsonArray,
  parseJsonNumberArray,
  toDate,
  toLowerCaseString,
  toNumber,
} from '@/core/utils/coercion.util';
import { EnumLeavePolicyStatus } from '@/features/leave-management/domain/enum';

@Injectable()
export class LeavePolicyRepositoryImpl implements LeavePolicyRepository<EntityManager> {
  async create(
    leave_policy: LeavePolicy,
    manager: EntityManager,
  ): Promise<LeavePolicy> {
    const query = `
      insert into ${lp} (
        leave_type_id, annual_entitlement, carry_limit, encash_limit,
        carried_over_years, effective_date, expiry_date, status, remarks,
        minimum_service_months, allowed_employment_types, allowed_employee_statuses, excluded_weekdays,
        deleted_by, deleted_at, created_by, created_at, updated_by, updated_at
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      returning *
    `;
    const result = await manager.query(query, [
      toNumber(leave_policy.leave_type_id),
      toNumber(leave_policy.annual_entitlement),
      toNumber(leave_policy.carry_limit),
      toNumber(leave_policy.encash_limit),
      toNumber(leave_policy.carried_over_years),
      toDate(leave_policy.effective_date),
      toDate(leave_policy.expiry_date),
      toLowerCaseString(leave_policy.status),
      toLowerCaseString(leave_policy.remarks),
      toNumber(leave_policy.minimum_service_months),
      parseJsonArray(leave_policy.allowed_employment_types),
      parseJsonArray(leave_policy.allowed_employee_statuses),
      parseJsonNumberArray(leave_policy.excluded_weekdays),
      toLowerCaseString(leave_policy.deleted_by),
      toDate(leave_policy.deleted_at),
      toLowerCaseString(leave_policy.created_by),
      toDate(leave_policy.created_at),
      toLowerCaseString(leave_policy.updated_by),
      toDate(leave_policy.updated_at),
    ]);
    return this.entityToModel(result[0]);
  }

  async update(
    id: number,
    dto: Partial<LeavePolicy>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;
    if (dto.annual_entitlement !== undefined) {
      updateFields.push(`annual_entitlement = $${paramIndex++}`);
      values.push(toNumber(dto.annual_entitlement));
    }
    if (dto.carry_limit !== undefined) {
      updateFields.push(`carry_limit = $${paramIndex++}`);
      values.push(toNumber(dto.carry_limit));
    }
    if (dto.encash_limit !== undefined) {
      updateFields.push(`encash_limit = $${paramIndex++}`);
      values.push(toNumber(dto.encash_limit));
    }
    if (dto.carried_over_years !== undefined) {
      updateFields.push(`carried_over_years = $${paramIndex++}`);
      values.push(toNumber(dto.carried_over_years));
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
      values.push(toLowerCaseString(dto.status));
    }
    if (dto.remarks !== undefined) {
      updateFields.push(`remarks = $${paramIndex++}`);
      values.push(toLowerCaseString(dto.remarks));
    }
    if (dto.minimum_service_months !== undefined) {
      updateFields.push(`minimum_service_months = $${paramIndex++}`);
      values.push(toNumber(dto.minimum_service_months));
    }
    if (dto.allowed_employment_types !== undefined) {
      updateFields.push(`allowed_employment_types = $${paramIndex++}`);
      values.push(parseJsonArray(dto.allowed_employment_types));
    }
    if (dto.allowed_employee_statuses !== undefined) {
      updateFields.push(`allowed_employee_statuses = $${paramIndex++}`);
      values.push(parseJsonArray(dto.allowed_employee_statuses));
    }
    if (dto.excluded_weekdays !== undefined) {
      updateFields.push(`excluded_weekdays = $${paramIndex++}`);
      values.push(parseJsonNumberArray(dto.excluded_weekdays));
    }
    if (dto.updated_by !== undefined) {
      updateFields.push(`updated_by = $${paramIndex++}`);
      values.push(toLowerCaseString(dto.updated_by));
    }
    if (updateFields.length === 0) return false;
    values.push(id);
    const query = `
      update ${lp}
      set ${updateFields.join(', ')}
      where id = $${paramIndex} and deleted_at is null
      returning id
    `;
    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async findById(
    id: number,
    manager: EntityManager,
  ): Promise<LeavePolicy | null> {
    const query = `
      select 
        lp.*, 
        lt.name as leave_type_name,
        lp.effective_date::text,
        lp.expiry_date::text
      from ${lp} lp
      left join ${lt} lt on lp.leave_type_id = lt.id
      where lp.id = $1
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
    const searchTerm = term ? `%${toLowerCaseString(term)}%` : '%';

    const joinClause = `
      from ${lp} lp
      left join ${lt} lt on lp.leave_type_id = lt.id
    `;
    let whereClause = `where lp.deleted_at ${is_archived ? 'is not null' : 'is null'}`;
    const queryParams: unknown[] = [];
    let paramIndex = 1;
    if (term) {
      whereClause += ` and (lower(lp.remarks) ilike $${paramIndex} or lower(lt.name) ilike $${paramIndex})`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    const countQuery = `
      select count(*) as total ${joinClause}
      ${whereClause}
    `;
    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    queryParams.push(limit, offset);
    const dataQuery = `
      select 
        lp.*, 
        lt.name as leave_type_name,
        lp.effective_date::text,
        lp.expiry_date::text
      ${joinClause}
      ${whereClause}
      order by lp.created_at desc
      limit $${paramIndex} offset $${paramIndex + 1}
    `;
    const dataResult = await manager.query(dataQuery, queryParams);
    const data = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
    return { data, meta: calculatePagination(totalRecords, page, limit) };
  }

  async retrieveActivePolicies(manager: EntityManager): Promise<LeavePolicy[]> {
    const query = `
      select lp.*, lt.name as leave_type_name
      from ${lp} lp
      left join ${lt} lt on lp.leave_type_id = lt.id
      where lp.status = $1 and lp.deleted_at is null
      order by lp.leave_type_id
    `;
    const result = await manager.query(query, [
      toLowerCaseString(EnumLeavePolicyStatus.ACTIVE),
    ]);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  async getActivePolicy(
    leave_type_id: number,
    manager: EntityManager,
  ): Promise<LeavePolicy | null> {
    const query = `
      select lp.*, lt.name as leave_type_name
      from ${lp} lp
      left join ${lt} lt on lp.leave_type_id = lt.id
      where lp.leave_type_id = $1 and lp.status = $2 and lp.deleted_at is null
    `;
    const result = await manager.query(query, [
      leave_type_id,
      toLowerCaseString(EnumLeavePolicyStatus.ACTIVE),
    ]);
    if (result.length === 0) return null;
    return this.entityToModel(result[0]);
  }

  async activatePolicy(id: number, manager: EntityManager): Promise<boolean> {
    const query = `
      update ${lp}
      set status = $1 where id = $2 and deleted_at is null returning id
    `;
    const result = await manager.query(query, [
      toLowerCaseString(EnumLeavePolicyStatus.ACTIVE),
      id,
    ]);
    return result.length > 0;
  }

  async retirePolicy(
    id: number,
    manager: EntityManager,
    expiry_date?: Date,
  ): Promise<boolean> {
    if (expiry_date) {
      const query = `
        update ${lp}
        set status = $1, expiry_date = $2 where id = $3 and deleted_at is null returning id
      `;
      const result = await manager.query(query, [
        toLowerCaseString(EnumLeavePolicyStatus.RETIRED),
        expiry_date,
        id,
      ]);
      return result.length > 0;
    }
    const query = `
      update ${lp}
      set status = $1 where id = $2 and deleted_at is null returning id
    `;
    const result = await manager.query(query, [
      toLowerCaseString(EnumLeavePolicyStatus.RETIRED),
      id,
    ]);
    return result.length > 0;
  }

  async findByLeaveType(
    leave_type_id: number,
    manager: EntityManager,
  ): Promise<LeavePolicy | null> {
    const query = `
      select lp.*, lt.name as leave_type_name
      from ${lp} lp
      left join ${lt} lt on lp.leave_type_id = lt.id
      where lp.leave_type_id = $1 and lp.deleted_at is null
    `;
    const result = await manager.query(query, [leave_type_id]);
    if (result.length === 0) return null;
    return this.entityToModel(result[0]);
  }

  async findAllByLeaveTypeAndEffectiveDateYear(
    leave_type_id: number,
    effective_date_year: number,
    manager: EntityManager,
  ): Promise<LeavePolicy[]> {
    const query = `
      select lp.*, lt.name as leave_type_name
      from ${lp} lp
      left join ${lt} lt on lp.leave_type_id = lt.id
      where lp.leave_type_id = $1 and lp.deleted_at is null and extract(year from lp.effective_date) = $2
    `;
    const result = await manager.query(query, [
      leave_type_id,
      toNumber(effective_date_year),
    ]);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  /**
   * Determines whether there exists any leave policy for the given leave type that overlaps with the given effective and expiry date (inclusive).
   * Should return true if there is at least one overlapping policy (ignoring soft-deleted records).
   * @param leave_type_id - Leave type primary key
   * @param effective_date - Proposed effective date of new policy
   * @param expiry_date - Proposed expiry date of new policy (may be undefined for open-ended)
   * @param manager - Entity manager
   * @param exclude_policy_id - Optionally exclude a certain policy id (for updates)
   * @returns True if there is at least one overlapping policy (ignoring soft-deleted records)
   */
  async hasOverlappingDateRange(
    leave_type_id: number,
    effective_date: Date,
    expiry_date: Date | undefined,
    manager: EntityManager,
    exclude_policy_id?: number,
  ): Promise<boolean> {
    // Build query parts
    let query = `
      select count(*)::int as total
      from ${lp} lp
      where lp.leave_type_id = $1 
        and lp.deleted_at is null
        and lp.effective_date <= $2
        and lp.expiry_date >= $3
    `;
    const params: unknown[] = [
      leave_type_id,
      toDate(expiry_date ?? effective_date), // If expiry is missing, treat as open-ended period
      toDate(effective_date),
    ];

    // Exclude a policy by id if provided (for updates)
    if (exclude_policy_id) {
      query += ` and lp.id != $4`;
      params.push(exclude_policy_id);
    }

    // Param order: leave_type_id, (expiry), (effective), [exclude_id]
    // logic: only overlap if periods intersect:
    //  (existing.effective_date <= new.expiry_date) AND (existing.expiry_date >= new.effective_date)
    // If expiry_date is undefined, treat new as open-ended (from effective_date onwards)
    // For backwards compatibility, if expiry is undefined, use effective_date for that predicate

    // Note: Convert all dates for query safety.
    const result = await manager.query(query, params);

    // Parse total result.
    const total = result?.[0]?.total ?? 0;
    return total > 0;
  }

  private entityToModel(entity: Record<string, unknown>): LeavePolicy {
    return new LeavePolicy({
      id: toNumber(entity.id),
      leave_type_id: toNumber(entity.leave_type_id),
      leave_type: toLowerCaseString(entity.leave_type_name),
      annual_entitlement: toNumber(entity.annual_entitlement),
      carry_limit: toNumber(entity.carry_limit),
      encash_limit: toNumber(entity.encash_limit),
      carried_over_years: toNumber(entity.carried_over_years),
      effective_date: toDate(entity.effective_date),
      expiry_date: toDate(entity.expiry_date),
      status: toLowerCaseString(entity.status) as EnumLeavePolicyStatus,
      remarks: toLowerCaseString(entity.remarks),
      minimum_service_months: toNumber(entity.minimum_service_months),
      allowed_employment_types: parseJsonArray(entity.allowed_employment_types),
      allowed_employee_statuses: parseJsonArray(
        entity.allowed_employee_statuses,
      ),
      excluded_weekdays: parseJsonNumberArray(entity.excluded_weekdays),
      deleted_by: toLowerCaseString(entity.deleted_by),
      deleted_at: toDate(entity.deleted_at),
      created_by: toLowerCaseString(entity.created_by),
      created_at: toDate(entity.created_at),
      updated_by: toLowerCaseString(entity.updated_by),
      updated_at: toDate(entity.updated_at),
    });
  }
}
