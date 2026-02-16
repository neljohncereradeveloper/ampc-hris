import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LeaveEncashmentRepository } from '@/features/leave-management/domain/repositories/leave-encashment.repository';
import { LeaveEncashment } from '@/features/leave-management/domain/models/leave-encashment.model';
import { LEAVE_MANAGEMENT_DATABASE_MODELS } from '@/features/leave-management/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';
import { toNumber } from '@/core/utils/coercion.util';
import { EnumLeaveEncashmentStatus } from '@/features/leave-management/domain/enum';

@Injectable()
export class LeaveEncashmentRepositoryImpl implements LeaveEncashmentRepository<EntityManager> {
  async create(
    leave_encashment: LeaveEncashment,
    manager: EntityManager,
  ): Promise<LeaveEncashment> {
    const query = `
      INSERT INTO ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_ENCASHMENTS} (
        employee_id, balance_id, total_days, amount, status,
        deleted_by, deleted_at, created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const result = await manager.query(query, [
      leave_encashment.employee_id,
      leave_encashment.balance_id,
      leave_encashment.total_days,
      leave_encashment.amount,
      leave_encashment.status ?? EnumLeaveEncashmentStatus.PENDING,
      leave_encashment.deleted_by ?? null,
      leave_encashment.deleted_at ?? null,
      leave_encashment.created_by ?? null,
      leave_encashment.created_at ?? new Date(),
      leave_encashment.updated_by ?? null,
      leave_encashment.updated_at ?? new Date(),
    ]);
    return this.entityToModel(result[0]);
  }

  async update(
    id: number,
    dto: Partial<LeaveEncashment>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;
    if (dto.total_days !== undefined) {
      updateFields.push(`total_days = $${paramIndex++}`);
      values.push(dto.total_days);
    }
    if (dto.amount !== undefined) {
      updateFields.push(`amount = $${paramIndex++}`);
      values.push(dto.amount);
    }
    if (dto.status !== undefined) {
      updateFields.push(`status = $${paramIndex++}`);
      values.push(dto.status);
    }
    if (dto.updated_by !== undefined) {
      updateFields.push(`updated_by = $${paramIndex++}`);
      values.push(dto.updated_by);
    }
    if (updateFields.length === 0) return false;
    values.push(id);

    const query = `
      UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_ENCASHMENTS}
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
  ): Promise<LeaveEncashment | null> {
    const query = `
      SELECT * FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_ENCASHMENTS}
      WHERE id = $1
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
  ): Promise<PaginatedResult<LeaveEncashment>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';

    let whereClause = is_archived
      ? 'WHERE deleted_at IS NOT NULL'
      : 'WHERE deleted_at IS NULL';
    const queryParams: unknown[] = [];
    let paramIndex = 1;
    if (term) {
      whereClause += ` AND (CAST(employee_id AS TEXT) ILIKE $${paramIndex} OR CAST(balance_id AS TEXT) ILIKE $${paramIndex})`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_ENCASHMENTS}
      ${whereClause}
    `;
    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    queryParams.push(limit, offset);
    const dataQuery = `
      SELECT * FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_ENCASHMENTS}
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await manager.query(dataQuery, queryParams);
    const data = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
    return { data, meta: calculatePagination(totalRecords, page, limit) };
  }

  async findPending(manager: EntityManager): Promise<LeaveEncashment[]> {
    const query = `
      SELECT * FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_ENCASHMENTS}
      WHERE status = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await manager.query(query, [
      EnumLeaveEncashmentStatus.PENDING,
    ]);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  async markAsPaid(
    id: number,
    payroll_ref: string,
    manager: EntityManager,
  ): Promise<boolean> {
    const query = `
      UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_ENCASHMENTS}
      SET status = $1, payroll_ref = $2, updated_at = $3
      WHERE id = $4 AND deleted_at IS NULL AND status = $5
      RETURNING id
    `;
    const result = await manager.query(query, [
      EnumLeaveEncashmentStatus.PAID,
      payroll_ref,
      new Date(),
      id,
      EnumLeaveEncashmentStatus.PENDING,
    ]);
    return result.length > 0;
  }

  async findByEmployee(
    employee_id: number,
    manager: EntityManager,
  ): Promise<LeaveEncashment[]> {
    const query = `
      SELECT * FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_ENCASHMENTS}
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await manager.query(query, [employee_id]);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  private entityToModel(entity: Record<string, unknown>): LeaveEncashment {
    return new LeaveEncashment({
      id: entity.id as number,
      employee_id: entity.employee_id as number,
      balance_id: entity.balance_id as number,
      total_days: toNumber(entity.total_days),
      amount: toNumber(entity.amount),
      status: entity.status as EnumLeaveEncashmentStatus,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
