import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { ProvinceBusinessException } from '@/features/201-management/domain/exceptions';
import { Province } from '@/features/201-management/domain/models';
import { ProvinceRepository } from '@/features/201-management/domain/repositories';
import {
  PROVINCE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateProvinceCommand } from '../../commands/province/create-province.command';

@Injectable()
export class CreateProvinceUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.PROVINCE)
    private readonly provinceRepository: ProvinceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    command: CreateProvinceCommand,
    requestInfo?: RequestInfo,
  ): Promise<Province> {
    return this.transactionHelper.executeTransaction(
      PROVINCE_ACTIONS.CREATE,
      async (manager) => {
        const new_province = Province.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        const created_province = await this.provinceRepository.create(
          new_province,
          manager,
        );

        if (!created_province) {
          throw new ProvinceBusinessException(
            'Province creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: PROVINCE_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.PROVINCES,
          details: JSON.stringify({
            id: created_province.id,
            desc1: created_province.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_province.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_province;
      },
    );
  }
}
