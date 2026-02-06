import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LeaveTypeRepository } from '@/features/shared-domain/domain/repositories';
import { LeaveType } from '@/features/shared-domain/domain/models';
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';

@Injectable()
export class LeaveTypeRepositoryImpl implements LeaveTypeRepository<EntityManager> {
  async findById(id: number, manager: EntityManager): Promise<LeaveType | null> {
    const query = `
      SELECT id, desc1
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      WHERE id = $1
    `;

    const result = await manager.query(query, [id]);
    if (result.length === 0) {
      return null;
    }

    return new LeaveType({
      id: result[0].id,
      desc1: result[0].desc1,
    });
  }

  async findByDescription(
    description: string,
    manager: EntityManager,
  ): Promise<LeaveType | null> {
    const query = `
      SELECT id, desc1
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES}
      WHERE desc1 = $1
    `;

    const result = await manager.query(query, [description]);
    if (result.length === 0) {
      return null;
    }

    return new LeaveType({
      id: result[0].id,
      desc1: result[0].desc1,
    });
  }
}
