import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { CityBusinessException } from '@/features/201-management/domain/exceptions';
import { CityRepository } from '@/features/201-management/domain/repositories';
import {
  CITY_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class RestoreCityUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.CITY)
    private readonly cityRepository: CityRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      CITY_ACTIONS.RESTORE,
      async (manager) => {
        const city = await this.cityRepository.findById(id, manager);
        if (!city) {
          throw new CityBusinessException(
            `City with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        city.restore();

        const success = await this.cityRepository.update(id, city, manager);
        if (!success) {
          throw new CityBusinessException(
            'City restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: CITY_ACTIONS.RESTORE,
          entity: MANAGEMENT_201_DATABASE_MODELS.CITIES,
          details: JSON.stringify({
            id,
            desc1: city.desc1,
            explanation: `City with ID : ${id} restored by USER : ${
              requestInfo?.user_name || ''
            }`,
            restored_by: requestInfo?.user_name || '',
            restored_at: getPHDateTime(new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
