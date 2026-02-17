import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { LeaveTypeEntity } from '@/features/shared-domain/infrastructure/database/entities/leave-type.entity';
import { LEAVE_TYPES } from './data';

export class SeedLeaveTypes {
  private readonly logger = new Logger(SeedLeaveTypes.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    for (const item of LEAVE_TYPES) {
      const existing = await this.entityManager.findOne(LeaveTypeEntity, {
        where: { code: item.code },
      });

      if (!existing) {
        const entity = this.entityManager.create(LeaveTypeEntity, {
          name: item.name,
          code: item.code,
          desc1: item.desc1,
          paid: item.paid,
          remarks: item.remarks ?? null,
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created leave type: ${item.name} (${item.code})`);
      }
    }
  }
}
