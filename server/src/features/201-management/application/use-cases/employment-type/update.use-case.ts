import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { EmploymentTypeBusinessException } from '@/features/201-management/domain/exceptions';
import { EmploymentType } from '@/features/201-management/domain/models';
import { EmploymentTypeRepository } from '@/features/201-management/domain/repositories';
import {
  EMPLOYMENT_TYPE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { UpdateEmploymentTypeCommand } from '../../commands/employment-type/update-employment-type.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateEmploymentTypeUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.EMPLOYMENT_TYPE)
    private readonly employmentTypeRepository: EmploymentTypeRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateEmploymentTypeCommand,
    requestInfo?: RequestInfo,
  ): Promise<EmploymentType | null> {
    return this.transactionHelper.executeTransaction(
      EMPLOYMENT_TYPE_ACTIONS.UPDATE,
      async (manager) => {
        const employment_type = await this.employmentTypeRepository.findById(
          id,
          manager,
        );
        if (!employment_type) {
          throw new EmploymentTypeBusinessException(
            'Employment type not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'desc1' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(employment_type, tracking_config);

        employment_type.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name || null,
        });

        const success = await this.employmentTypeRepository.update(
          id,
          employment_type,
          manager,
        );
        if (!success) {
          throw new EmploymentTypeBusinessException(
            'Employment type update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.employmentTypeRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: EMPLOYMENT_TYPE_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_TYPES,
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
