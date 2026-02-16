import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LeaveRequestRepository } from '@/features/leave-management/domain/repositories/leave-request.repository';
import { LeaveRequest } from '@/features/leave-management/domain/models/leave-request.model';
import { LEAVE_MANAGEMENT_DATABASE_MODELS } from '@/features/leave-management/domain/constants';
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';

const LR = LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS;
const LT = SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES;
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';
import { EnumLeaveRequestStatus } from '@/features/leave-management/domain/enum';

function parseDecimal(value: unknown): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

@Injectable()
export class LeaveRequestRepositoryImpl
  implements LeaveRequestRepository<EntityManager>
{
  async create(
    leave_request: LeaveRequest,
    manager: EntityManager,
  ): Promise<LeaveRequest> {
    const query = `
      INSERT INTO ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS} (
        employee_id, leave_type_id, start_date, end_date, total_days,
        reason, balance_id, approval_date, approval_by, remarks, status,
        deleted_by, deleted_at, created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;
    const result = await manager.query(query, [
      leave_request.employee_id,
      leave_request.leave_type_id,
      leave_request.start_date,
      leave_request.end_date,
      leave_request.total_days,
      leave_request.reason,
      leave_request.balance_id,
      leave_request.approval_date ?? null,
      leave_request.approval_by ?? null,
      leave_request.remarks ?? null,
      leave_request.status ?? EnumLeaveRequestStatus.PENDING,
      leave_request.deleted_by ?? null,
      leave_request.deleted_at ?? null,
      leave_request.created_by ?? null,
      leave_request.created_at ?? new Date(),
      leave_request.updated_by ?? null,
      leave_request.updated_at ?? new Date(),
    ]);
    return this.entityToModel(result[0]);
  }

  async update(
    id: number,
    dto: Partial<LeaveRequest>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.start_date !== undefined) {
      updateFields.push(`start_date = $${paramIndex++}`);
      values.push(dto.start_date);
    }
    if (dto.end_date !== undefined) {
      updateFields.push(`end_date = $${paramIndex++}`);
      values.push(dto.end_date);
    }
    if (dto.total_days !== undefined) {
      updateFields.push(`total_days = $${paramIndex++}`);
      values.push(dto.total_days);
    }
    if (dto.reason !== undefined) {
      updateFields.push(`reason = $${paramIndex++}`);
      values.push(dto.reason);
    }
    if (dto.remarks !== undefined) {
      updateFields.push(`remarks = $${paramIndex++}`);
      values.push(dto.remarks);
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
      UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL AND status = $${paramIndex + 1}
      RETURNING id
    `;
    const result = await manager.query(query, [
      ...values,
      EnumLeaveRequestStatus.PENDING,
    ]);
    return result.length > 0;
  }

  async findById(
    id: number,
    manager: EntityManager,
  ): Promise<LeaveRequest | null> {
    const query = `
      SELECT lr.*, lt.name AS leave_type_name
      FROM ${LR} lr
      LEFT JOIN ${LT} lt ON lr.leave_type_id = lt.id AND lt.deleted_at IS NULL
      WHERE lr.id = $1
    `;
    const result = await manager.query(query, [id]);
    if (result.length === 0) return null;
    return this.entityToModel(result[0]);
  }

  async findByEmployee(
    employee_id: number,
    manager: EntityManager,
  ): Promise<LeaveRequest[]> {
    const query = `
      SELECT lr.*, lt.name AS leave_type_name
      FROM ${LR} lr
      LEFT JOIN ${LT} lt ON lr.leave_type_id = lt.id AND lt.deleted_at IS NULL
      WHERE lr.employee_id = $1 AND lr.deleted_at IS NULL
      ORDER BY lr.start_date DESC
    `;
    const result = await manager.query(query, [employee_id]);
    return result.map((row: Record<string, unknown>) => this.entityToModel(row));
  }

  async findPending(manager: EntityManager): Promise<LeaveRequest[]> {
    const query = `
      SELECT lr.*, lt.name AS leave_type_name
      FROM ${LR} lr
      LEFT JOIN ${LT} lt ON lr.leave_type_id = lt.id AND lt.deleted_at IS NULL
      WHERE lr.status = $1 AND lr.deleted_at IS NULL
      ORDER BY lr.created_at DESC
    `;
    const result = await manager.query(query, [EnumLeaveRequestStatus.PENDING]);
    return result.map((row: Record<string, unknown>) => this.entityToModel(row));
  }

  async findPaginatedPending(
    term: string,
    page: number,
    limit: number,
    manager: EntityManager,
  ): Promise<PaginatedResult<LeaveRequest>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';
    const whereClause = `WHERE status = $1 AND deleted_at IS NULL`;
    const countParams: unknown[] = [EnumLeaveRequestStatus.PENDING];
    const dataParams: unknown[] = [EnumLeaveRequestStatus.PENDING];

    const joinClause = `
      FROM ${LR} lr
      LEFT JOIN ${LT} lt ON lr.leave_type_id = lt.id AND lt.deleted_at IS NULL
    `;
    let countQuery = `
      SELECT COUNT(*) as total
      ${joinClause}
      WHERE lr.status = $1 AND lr.deleted_at IS NULL
    `;
    if (term) {
      countQuery = `
        SELECT COUNT(*) as total
        ${joinClause}
        WHERE lr.status = $1 AND lr.deleted_at IS NULL AND (lr.reason ILIKE $2 OR lt.name ILIKE $2)
      `;
      countParams.push(searchTerm);
    }
    const countResult = await manager.query(countQuery, countParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    let dataQuery: string;
    if (term) {
      dataParams.push(searchTerm, limit, offset);
      dataQuery = `
        SELECT lr.*, lt.name AS leave_type_name
        ${joinClause}
        WHERE lr.status = $1 AND lr.deleted_at IS NULL AND (lr.reason ILIKE $2 OR lt.name ILIKE $2)
        ORDER BY lr.created_at DESC
        LIMIT $3 OFFSET $4
      `;
    } else {
      dataParams.push(limit, offset);
      dataQuery = `
        SELECT lr.*, lt.name AS leave_type_name
        ${joinClause}
        WHERE lr.status = $1 AND lr.deleted_at IS NULL
        ORDER BY lr.created_at DESC
        LIMIT $2 OFFSET $3
      `;
    }
    const dataResult = await manager.query(dataQuery, dataParams);
    const data = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
    return { data, meta: calculatePagination(totalRecords, page, limit) };
  }

  async findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    manager: EntityManager,
  ): Promise<PaginatedResult<LeaveRequest>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';
    const whereArchived = is_archived
      ? 'deleted_at IS NOT NULL'
      : 'deleted_at IS NULL';
    const queryParams: unknown[] = [];
    let paramIndex = 1;
    if (term) {
      queryParams.push(searchTerm);
      paramIndex++;
    }
    queryParams.push(limit, offset);

    const joinClause = `
      FROM ${LR} lr
      LEFT JOIN ${LT} lt ON lr.leave_type_id = lt.id AND lt.deleted_at IS NULL
    `;
    const countQuery = `
      SELECT COUNT(*) as total
      ${joinClause}
      WHERE lr.deleted_at ${is_archived ? 'IS NOT NULL' : 'IS NULL'}${term ? ` AND (lr.reason ILIKE $1 OR lt.name ILIKE $1)` : ''}
    `;
    const countResult = await manager.query(
      countQuery,
      term ? [searchTerm] : [],
    );
    const totalRecords = parseInt(countResult[0].total, 10);

    const dataQuery = `
      SELECT lr.*, lt.name AS leave_type_name
      ${joinClause}
      WHERE lr.deleted_at ${is_archived ? 'IS NOT NULL' : 'IS NULL'}${term ? ` AND (lr.reason ILIKE $1 OR lt.name ILIKE $1)` : ''}
      ORDER BY lr.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await manager.query(dataQuery, queryParams);
    const data = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
    return { data, meta: calculatePagination(totalRecords, page, limit) };
  }

  async findPaginatedByEmployee(
    employee_id: number,
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    manager: EntityManager,
  ): Promise<PaginatedResult<LeaveRequest>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';
    const whereArchived = is_archived
      ? 'deleted_at IS NOT NULL'
      : 'deleted_at IS NULL';
    const baseWhere = `employee_id = $1 AND ${whereArchived}`;
    const countParams: unknown[] = [employee_id];
    const dataParams: unknown[] = [employee_id];
    if (term) {
      countParams.push(searchTerm);
      dataParams.push(searchTerm);
    }
    const joinClause = `
      FROM ${LR} lr
      LEFT JOIN ${LT} lt ON lr.leave_type_id = lt.id AND lt.deleted_at IS NULL
    `;
    const countQuery = `
      SELECT COUNT(*) as total
      ${joinClause}
      WHERE lr.employee_id = $1 AND lr.deleted_at ${is_archived ? 'IS NOT NULL' : 'IS NULL'}${term ? ` AND (lr.reason ILIKE $2 OR lt.name ILIKE $2)` : ''}
    `;
    const countResult = await manager.query(countQuery, countParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    const limitParam = term ? 3 : 2;
    const offsetParam = term ? 4 : 3;
    dataParams.push(limit, offset);
    const dataQuery = `
      SELECT lr.*, lt.name AS leave_type_name
      ${joinClause}
      WHERE lr.employee_id = $1 AND lr.deleted_at ${is_archived ? 'IS NOT NULL' : 'IS NULL'}${term ? ` AND (lr.reason ILIKE $2 OR lt.name ILIKE $2)` : ''}
      ORDER BY lr.created_at DESC
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;
    const dataResult = await manager.query(dataQuery, dataParams);
    const data = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
    return { data, meta: calculatePagination(totalRecords, page, limit) };
  }

  async updateStatus(
    id: number,
    status: string,
    user_id: number,
    remarks: string,
    manager: EntityManager,
  ): Promise<boolean> {
    const query = `
      UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS}
      SET status = $1, approval_by = $2, approval_date = $3, remarks = $4, updated_at = $5
      WHERE id = $6 AND deleted_at IS NULL
      RETURNING id
    `;
    const result = await manager.query(query, [
      status,
      user_id,
      new Date(),
      remarks ?? '',
      new Date(),
      id,
    ]);
    return result.length > 0;
  }

  async findOverlappingRequests(
    employee_id: number,
    start_date: Date,
    end_date: Date,
    manager: EntityManager,
    exclude_id: number | undefined,
  ): Promise<LeaveRequest[]> {
    let query = `
      SELECT lr.*, lt.name AS leave_type_name
      FROM ${LR} lr
      LEFT JOIN ${LT} lt ON lr.leave_type_id = lt.id AND lt.deleted_at IS NULL
      WHERE lr.employee_id = $1 AND lr.deleted_at IS NULL
        AND lr.status = $2
        AND (lr.start_date, lr.end_date) OVERLAPS ($3::date, $4::date)
    `;
    const params: unknown[] = [
      employee_id,
      EnumLeaveRequestStatus.APPROVED,
      start_date,
      end_date,
    ];
    if (exclude_id !== undefined) {
      query += ` AND lr.id != $5`;
      params.push(exclude_id);
    }
    query += ` ORDER BY lr.start_date`;
    const result = await manager.query(query, params);
    return result.map((row: Record<string, unknown>) => this.entityToModel(row));
  }

  private entityToModel(entity: Record<string, unknown>): LeaveRequest {
    return new LeaveRequest({
      id: entity.id as number,
      employee_id: entity.employee_id as number,
      leave_type_id: entity.leave_type_id as number,
      leave_type: (entity.leave_type_name as string) ?? undefined,
      start_date: entity.start_date as Date,
      end_date: entity.end_date as Date,
      total_days: parseDecimal(entity.total_days),
      reason: entity.reason as string,
      balance_id: entity.balance_id as number,
      approval_date: (entity.approval_date as Date) ?? undefined,
      approval_by: (entity.approval_by as number) ?? undefined,
      remarks: (entity.remarks as string) ?? undefined,
      status: (entity.status as EnumLeaveRequestStatus) ?? EnumLeaveRequestStatus.PENDING,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
