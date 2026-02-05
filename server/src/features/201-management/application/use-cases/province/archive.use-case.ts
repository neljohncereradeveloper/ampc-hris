import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { ProvinceBusinessException } from '@/features/201-management/domain/exceptions';
import { ProvinceRepository } from '@/features/201-management/domain/repositories';
import {
  PROVINCE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveProvinceUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.PROVINCE)
    private readonly provinceRepository: ProvinceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      PROVINCE_ACTIONS.ARCHIVE,
      async (manager) => {
        const province = await this.provinceRepository.findById(id, manager);
        if (!province) {
          throw new ProvinceBusinessException(
            `Province with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        province.archive(requestInfo?.user_name || '');

        const success = await this.provinceRepository.update(
          id,
          province,
          manager,
        );
        if (!success) {
          throw new ProvinceBusinessException(
            'Province archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: PROVINCE_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.PROVINCES,
          details: JSON.stringify({
            id,
            desc1: province.desc1,
            explanation: `Province with ID : ${id} archived by USER : ${requestInfo?.user_name || ''}`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(province.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
