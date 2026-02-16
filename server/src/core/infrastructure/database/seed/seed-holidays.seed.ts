import { EntityManager } from 'typeorm';
import { Logger } from '@nestjs/common';
import { HolidayEntity } from '@/features/shared-domain/infrastructure/database/entities/holiday.entity';
import { getPHDateTime } from '@/core/utils/date.util';
import { HOLIDAYS_2026 } from './data';

export class SeedHolidays {
  private readonly logger = new Logger(SeedHolidays.name);

  constructor(private readonly entityManager: EntityManager) {}

  async run(): Promise<void> {
    const seedBy = 'seed-runner';

    for (const item of HOLIDAYS_2026) {
      const existing = await this.entityManager.findOne(HolidayEntity, {
        where: { name: item.name, date: new Date(item.date) },
        withDeleted: true,
      });

      if (!existing) {
        const entity = this.entityManager.create(HolidayEntity, {
          name: item.name,
          date: new Date(item.date),
          type: item.type,
          description: null,
          is_recurring: item.is_recurring,
          created_by: seedBy,
          created_at: getPHDateTime(),
        });
        await this.entityManager.save(entity);
        this.logger.log(`Created holiday: ${item.name} (${item.date})`);
      }
    }
  }
}
