import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { CityBusinessException } from '@/features/201-management/domain/exceptions';
import { City } from '@/features/201-management/domain/models';
import { CityRepository } from '@/features/201-management/domain/repositories';
import {
  CITY_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateCityCommand } from '../../commands/city/create-city.command';

@Injectable()
export class CreateCityUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.CITY)
    private readonly cityRepository: CityRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    command: CreateCityCommand,
    requestInfo?: RequestInfo,
  ): Promise<City> {
    return this.transactionHelper.executeTransaction(
      CITY_ACTIONS.CREATE,
      async (manager) => {
        const new_city = City.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        const created_city = await this.cityRepository.create(
          new_city,
          manager,
        );

        if (!created_city) {
          throw new CityBusinessException(
            'City creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: CITY_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.CITIES,
          details: JSON.stringify({
            id: created_city.id,
            desc1: created_city.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_city.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_city;
      },
    );
  }
}
