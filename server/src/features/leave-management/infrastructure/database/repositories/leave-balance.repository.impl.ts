import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LeaveBalanceRepository } from '@/features/leave-management/domain/repositories/leave-balance.repository';
import { LeaveBalance } from '@/features/leave-management/domain/models/leave-balance.model';
import { LEAVE_MANAGEMENT_DATABASE_MODELS } from '@/features/leave-management/domain/constants';
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';

const LB = LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES;
const LT = SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES;
import { toNumber } from '@/core/utils/coercion.util';
import { EnumLeaveBalanceStatus } from '@/features/leave-management/domain/enum';

@Injectable()
export class LeaveBalanceRepositoryImpl implements LeaveBalanceRepository<EntityManager> {
  async create(
    leave_balance: LeaveBalance,
    manager: EntityManager,
  ): Promise<LeaveBalance> {
    const query = `
      INSERT INTO ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES} (
        employee_id, leave_type_id, policy_id, year,
        beginning_balance, earned, used, carried_over, encashed, remaining,
        last_transaction_date, status, remarks,
        deleted_by, deleted_at, created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;
    const result = await manager.query(query, [
      leave_balance.employee_id,
      leave_balance.leave_type_id,
      leave_balance.policy_id,
      leave_balance.year,
      leave_balance.beginning_balance,
      leave_balance.earned,
      leave_balance.used,
      leave_balance.carried_over,
      leave_balance.encashed,
      leave_balance.remaining,
      leave_balance.last_transaction_date ?? null,
      leave_balance.status,
      leave_balance.remarks ?? null,
      leave_balance.deleted_by ?? null,
      leave_balance.deleted_at ?? null,
      leave_balance.created_by ?? null,
      leave_balance.created_at ?? new Date(),
      leave_balance.updated_by ?? null,
      leave_balance.updated_at ?? new Date(),
    ]);
    return this.entityToModel(result[0]);
  }

  async update(
    id: number,
    dto: Partial<LeaveBalance>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.earned !== undefined) {
      updateFields.push(`earned = $${paramIndex++}`);
      values.push(dto.earned);
    }
    if (dto.used !== undefined) {
      updateFields.push(`used = $${paramIndex++}`);
      values.push(dto.used);
    }
    if (dto.carried_over !== undefined) {
      updateFields.push(`carried_over = $${paramIndex++}`);
      values.push(dto.carried_over);
    }
    if (dto.encashed !== undefined) {
      updateFields.push(`encashed = $${paramIndex++}`);
      values.push(dto.encashed);
    }
    if (dto.remaining !== undefined) {
      updateFields.push(`remaining = $${paramIndex++}`);
      values.push(dto.remaining);
    }
    if (dto.last_transaction_date !== undefined) {
      updateFields.push(`last_transaction_date = $${paramIndex++}`);
      values.push(dto.last_transaction_date);
    }
    if (dto.status !== undefined) {
      updateFields.push(`status = $${paramIndex++}`);
      values.push(dto.status);
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

    values.push(id);

    const query = `
      UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES}
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
  ): Promise<LeaveBalance | null> {
    const query = `
      SELECT lb.*, lt.name AS leave_type_name
      FROM ${LB} lb
      LEFT JOIN ${LT} lt ON lb.leave_type_id = lt.id
      WHERE lb.id = $1
    `;
    const result = await manager.query(query, [id]);
    if (result.length === 0) return null;
    return this.entityToModel(result[0]);
  }

  async loadEmployeeBalanceByYear(
    employee_id: number,
    year: string,
    manager: EntityManager,
  ): Promise<LeaveBalance[]> {
    const query = `
      SELECT lb.*, lt.name AS leave_type_name
      FROM ${LB} lb
      LEFT JOIN ${LT} lt ON lb.leave_type_id = lt.id
      WHERE lb.employee_id = $1 AND lb.year = $2 AND lb.deleted_at IS NULL
      ORDER BY lb.leave_type_id
    `;
    const result = await manager.query(query, [employee_id, year]);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  async loadEmployeeBalancesByLeaveTypeAndYear(
    employee_id: number,
    leave_type_id: number,
    year: string,
    manager: EntityManager,
  ): Promise<LeaveBalance | null> {
    const query = `
      SELECT lb.*, lt.name AS leave_type_name
      FROM ${LB} lb
      LEFT JOIN ${LT} lt ON lb.leave_type_id = lt.id
      WHERE lb.employee_id = $1 AND lb.leave_type_id = $2 AND lb.year = $3 AND lb.deleted_at IS NULL
    `;
    const result = await manager.query(query, [
      employee_id,
      leave_type_id,
      year,
    ]);
    if (result.length === 0) return null;
    return this.entityToModel(result[0]);
  }

  async closeBalance(id: number, manager: EntityManager): Promise<boolean> {
    const query = `
      UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES}
      SET status = $1
      WHERE id = $2 AND deleted_at IS NULL AND status IN ($3, $4)
      RETURNING id
    `;
    const result = await manager.query(query, [
      EnumLeaveBalanceStatus.CLOSED,
      id,
      EnumLeaveBalanceStatus.OPEN,
      EnumLeaveBalanceStatus.REOPENED,
    ]);
    return result.length > 0;
  }

  async resetBalancesForYear(
    year: string,
    manager: EntityManager,
  ): Promise<boolean> {
    const query = `
      UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_BALANCES}
      SET status = $1
      WHERE year = $2 AND deleted_at IS NULL AND status IN ($3, $4)
    `;
    await manager.query(query, [
      EnumLeaveBalanceStatus.CLOSED,
      year,
      EnumLeaveBalanceStatus.OPEN,
      EnumLeaveBalanceStatus.REOPENED,
    ]);
    return true;
  }

  private entityToModel(entity: Record<string, unknown>): LeaveBalance {
    return new LeaveBalance({
      id: entity.id as number,
      employee_id: entity.employee_id as number,
      leave_type_id: entity.leave_type_id as number,
      leave_type: (entity.leave_type_name as string) ?? undefined,
      policy_id: entity.policy_id as number,
      year: entity.year as string,
      beginning_balance: toNumber(entity.beginning_balance),
      earned: toNumber(entity.earned),
      used: toNumber(entity.used),
      carried_over: toNumber(entity.carried_over),
      encashed: toNumber(entity.encashed),
      remaining: toNumber(entity.remaining),
      last_transaction_date:
        (entity.last_transaction_date as Date) ?? undefined,
      status: entity.status as EnumLeaveBalanceStatus,
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
