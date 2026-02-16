import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { ReferenceBusinessException } from '@/features/201-management/domain/exceptions';
import { Reference } from '@/features/201-management/domain/models';
import { ReferenceRepository } from '@/features/201-management/domain/repositories';
import {
  REFERENCE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { UpdateReferenceCommand } from '../../commands/reference/update-reference.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateReferenceUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.REFERENCE)
    private readonly referenceRepository: ReferenceRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateReferenceCommand,
    requestInfo?: RequestInfo,
  ): Promise<Reference | null> {
    return this.transactionHelper.executeTransaction(
      REFERENCE_ACTIONS.UPDATE,
      async (manager) => {
        const reference = await this.referenceRepository.findById(id, manager);
        if (!reference) {
          throw new ReferenceBusinessException(
            'Reference not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'fname' },
          { field: 'mname' },
          { field: 'lname' },
          { field: 'suffix' },
          { field: 'cellphone_number' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(reference, tracking_config);

        reference.update({
          fname: command.fname,
          mname: command.mname,
          lname: command.lname,
          suffix: command.suffix,
          cellphone_number: command.cellphone_number,
          updated_by: requestInfo?.user_name || null,
        });

        const success = await this.referenceRepository.update(
          id,
          reference,
          manager,
        );
        if (!success) {
          throw new ReferenceBusinessException(
            'Reference update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.referenceRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: REFERENCE_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.REFERENCES,
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
