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
import { UpdateBarangayCommand } from '../../commands/barangay/update-barangay.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateBarangayUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.BARANGAY)
    private readonly barangayRepository: BarangayRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateBarangayCommand,
    requestInfo?: RequestInfo,
  ): Promise<Barangay | null> {
    return this.transactionHelper.executeTransaction(
      BARANGAY_ACTIONS.UPDATE,
      async (manager) => {
        // Validate barangay existence
        const barangay = await this.barangayRepository.findById(id, manager);
        if (!barangay) {
          throw new BarangayBusinessException(
            'Barangay not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Define fields to track for change logging
        const tracking_config: FieldExtractorConfig[] = [
          { field: 'desc1' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        // Capture before state for logging
        const before_state = extractEntityState(barangay, tracking_config);

        // Use domain model method to update (encapsulates business logic and validation)
        barangay.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name || null,
        });

        // Update the barangay in the database
        const success = await this.barangayRepository.update(
          id,
          barangay,
          manager,
        );
        if (!success) {
          throw new BarangayBusinessException(
            'Barangay update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        // Retrieve the updated barangay
        const updated_result = await this.barangayRepository.findById(
          id,
          manager,
        );

        // Capture after state for logging
        const after_state = extractEntityState(updated_result, tracking_config);

        // Get only the changed fields with old and new states
        const changed_fields = getChangedFields(before_state, after_state);

        // Log the update with only changed fields (old state and new state)
        const log = ActivityLog.create({
          action: BARANGAY_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.BARANGAYS,
          details: JSON.stringify({
            id: updated_result?.id,
            changed_fields: changed_fields,
            updated_by: requestInfo?.user_name || '',
            updated_at: getPHDateTime(updated_result?.updated_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_result;
      },
    );
  }
}
