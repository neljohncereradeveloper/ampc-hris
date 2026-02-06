import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { LeaveTypeEntity } from '@/features/shared-domain/infrastructure/database/entities/leave-type.entity';
import { LEAVE_TYPES } from './data';

export class SeedLeaveTypes {
  private readonly logger = new Logger(SeedLeaveTypes.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    for (const desc1 of LEAVE_TYPES) {
      const existing = await this.entityManager.findOne(LeaveTypeEntity, {
        where: { desc1 },
      });

      if (!existing) {
        const entity = this.entityManager.create(LeaveTypeEntity, { desc1 });
        await this.entityManager.save(entity);
        this.logger.log(`Created leave type: ${desc1}`);
      }
    }
  }
}
