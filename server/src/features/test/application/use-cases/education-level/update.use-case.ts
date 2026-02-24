import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { EducationLevelBusinessException } from '@/features/test/domain/exceptions';
import { EducationLevel } from '@/features/test/domain/models';
import { EducationLevelRepository } from '@/features/test/domain/repositories';
import {
  EDUCATION_LEVEL_ACTIONS,
  TEST_DATABASE_MODELS,
  TEST_TOKENS,
} from '@/features/test/domain/constants';
import { UpdateEducationLevelCommand } from '../../commands/education-level/update-education-level.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateEducationLevelUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(TEST_TOKENS.EDUCATION_LEVEL)
    private readonly educationLevelRepository: EducationLevelRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateEducationLevelCommand,
    requestInfo?: RequestInfo,
  ): Promise<EducationLevel | null> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_LEVEL_ACTIONS.UPDATE,
      async (manager) => {
        const education_level = await this.educationLevelRepository.findById(
          id,
          manager,
        );
        if (!education_level) {
          throw new EducationLevelBusinessException(
            'EducationLevel not found',
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

        const before_state = extractEntityState(
          education_level,
          tracking_config,
        );

        education_level.update({
          desc1: command.desc1,
          updated_by: requestInfo?.user_name,
        });

        const success = await this.educationLevelRepository.update(
          id,
          education_level,
          manager,
        );
        if (!success) {
          throw new EducationLevelBusinessException(
            'EducationLevel update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.educationLevelRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: EDUCATION_LEVEL_ACTIONS.UPDATE,
          entity: TEST_DATABASE_MODELS.EDUCATION_LEVELS,
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
