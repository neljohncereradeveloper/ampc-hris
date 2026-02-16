import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { BranchEntity } from '@/features/shared-domain/infrastructure/database/entities/branch.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { BRANCHES } from './data';

export class SeedBranches {
  private readonly logger = new Logger(SeedBranches.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';
    for (const desc1 of BRANCHES) {
      const existing = await this.entityManager.findOne(BranchEntity, {
        where: { desc1 },
        withDeleted: true,
      });
      if (!existing) {
        const entity = this.entityManager.create(BranchEntity, {
          desc1,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created branch: ${desc1}`);
      }
    }
  }
}
