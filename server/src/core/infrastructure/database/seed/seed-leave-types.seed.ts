import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { LeaveTypeEntity } from '@/features/shared-domain/infrastructure/database/entities/leave-type.entity';
import { LEAVE_TYPES } from './data';
import { toLowerCaseString } from '@/core/utils/coercion.util';
import { getPHDateTime } from '@/core/utils/date.util';

export class SeedLeaveTypes {
  private readonly logger = new Logger(SeedLeaveTypes.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    for (const item of LEAVE_TYPES) {
      const seedBy = 'seed-runner';
      const existing = await this.entityManager.findOne(LeaveTypeEntity, {
        where: { code: toLowerCaseString(item.code) },
      });

      if (!existing) {
        const entity = this.entityManager.create(LeaveTypeEntity, {
          name: toLowerCaseString(item.name)!,
          code: toLowerCaseString(item.code)!,
          desc1: toLowerCaseString(item.desc1)!,
          paid: item.paid,
          remarks: toLowerCaseString(item.remarks),
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(
          `Created leave type: ${toLowerCaseString(item.name)!} (${toLowerCaseString(item.code)!})`,
        );
      }
    }
  }
}
