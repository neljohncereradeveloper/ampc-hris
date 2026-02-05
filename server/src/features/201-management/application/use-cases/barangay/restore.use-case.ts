import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { BarangayBusinessException } from '@/features/201-management/domain/exceptions';
import { BarangayRepository } from '@/features/201-management/domain/repositories';
import {
  BARANGAY_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class RestoreBarangayUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.BARANGAY)
    private readonly barangayRepository: BarangayRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      BARANGAY_ACTIONS.RESTORE,
      async (manager) => {
        // Validate existence
        const barangay = await this.barangayRepository.findById(id, manager);
        if (!barangay) {
          throw new BarangayBusinessException(
            `Barangay with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Use domain method to restore
        barangay.restore();

        // Update the entity
        const success = await this.barangayRepository.update(
          id,
          barangay,
          manager,
        );
        if (!success) {
          throw new BarangayBusinessException(
            'Barangay restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the restore
        const log = ActivityLog.create({
          action: BARANGAY_ACTIONS.RESTORE,
          entity: MANAGEMENT_201_DATABASE_MODELS.BARANGAYS,
          details: JSON.stringify({
            id,
            desc1: barangay.desc1,
            explanation: `Barangay with ID : ${id} restored by USER : ${requestInfo?.user_name || ''
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
