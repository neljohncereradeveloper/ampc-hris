import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LeaveTransactionRepository } from '@/features/leave-management/domain/repositories/leave-transaction.repository';
import { LeaveTransaction } from '@/features/leave-management/domain/models/leave-transaction.model';
import { LEAVE_MANAGEMENT_DATABASE_MODELS } from '@/features/leave-management/domain/constants';
import { toNumber } from '@/core/utils/coercion.util';
import { EnumLeaveTransactionType } from '@/features/leave-management/domain/enum';

@Injectable()
export class LeaveTransactionRepositoryImpl
  implements LeaveTransactionRepository<EntityManager>
{
  async create(
    leave_transaction: LeaveTransaction,
    manager: EntityManager,
  ): Promise<LeaveTransaction> {
    const query = `
      INSERT INTO ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_TRANSACTIONS} (
        balance_id, transaction_type, days, remarks,
        deleted_by, deleted_at, created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await manager.query(query, [
      leave_transaction.balance_id,
      leave_transaction.transaction_type,
      leave_transaction.days,
      leave_transaction.remarks,
      leave_transaction.deleted_by ?? null,
      leave_transaction.deleted_at ?? null,
      leave_transaction.created_by ?? null,
      leave_transaction.created_at ?? new Date(),
      leave_transaction.updated_by ?? null,
      leave_transaction.updated_at ?? new Date(),
    ]);
    return this.entityToModel(result[0]);
  }

  async findByBalance(
    balance_id: number,
    manager: EntityManager,
  ): Promise<LeaveTransaction[]> {
    const query = `
      SELECT * FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_TRANSACTIONS}
      WHERE balance_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;
    const result = await manager.query(query, [balance_id]);
    return result.map((row: Record<string, unknown>) => this.entityToModel(row));
  }

  async recordTransaction(
    balance_id: number,
    type: EnumLeaveTransactionType,
    days: number,
    remarks: string,
    user_id: number,
    manager: EntityManager,
  ): Promise<LeaveTransaction> {
    const user_str = String(user_id);
    const leave_transaction = LeaveTransaction.create({
      balance_id,
      transaction_type: type,
      days,
      remarks,
      created_by: user_str,
    });
    return this.create(leave_transaction, manager);
  }

  private entityToModel(entity: Record<string, unknown>): LeaveTransaction {
    return new LeaveTransaction({
      id: entity.id as number,
      balance_id: entity.balance_id as number,
      transaction_type: entity.transaction_type as EnumLeaveTransactionType,
      days: toNumber(entity.days),
      remarks: entity.remarks as string,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
