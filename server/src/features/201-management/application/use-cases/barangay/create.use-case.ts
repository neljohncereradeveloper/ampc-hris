import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { BarangayBusinessException } from '@/features/201-management/domain/exceptions';
import { Barangay } from '@/features/201-management/domain/models';
import { BarangayRepository } from '@/features/201-management/domain/repositories';
import {
  BARANGAY_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateBarangayCommand } from '../../commands/barangay/create-barangay.command';

@Injectable()
export class CreateBarangayUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.BARANGAY)
    private readonly barangayRepository: BarangayRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    command: CreateBarangayCommand,
    requestInfo?: RequestInfo,
  ): Promise<Barangay> {
    return this.transactionHelper.executeTransaction(
      BARANGAY_ACTIONS.CREATE,
      async (manager) => {
        // Create domain model (validates automatically)
        const new_barangay = Barangay.create({
          desc1: command.desc1,
          created_by: requestInfo?.user_name || null,
        });

        // Persist the entity
        const created_barangay = await this.barangayRepository.create(
          new_barangay,
          manager,
        );

        if (!created_barangay) {
          throw new BarangayBusinessException(
            'Barangay creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Log the creation
        const log = ActivityLog.create({
          action: BARANGAY_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.BARANGAYS,
          details: JSON.stringify({
            id: created_barangay.id,
            desc1: created_barangay.desc1,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_barangay.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_barangay;
      },
    );
  }
}
