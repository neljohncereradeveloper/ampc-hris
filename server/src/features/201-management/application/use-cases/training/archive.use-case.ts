import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { TrainingBusinessException } from '@/features/201-management/domain/exceptions';
import { TrainingRepository } from '@/features/201-management/domain/repositories';
import {
  TRAINING_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveTrainingUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.TRAINING)
    private readonly trainingRepository: TrainingRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      TRAINING_ACTIONS.ARCHIVE,
      async (manager) => {
        const training = await this.trainingRepository.findById(
          id,
          manager,
        );
        if (!training) {
          throw new TrainingBusinessException(
            `Training with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        training.archive(requestInfo?.user_name || '');

        const success = await this.trainingRepository.update(
          id,
          training,
          manager,
        );
        if (!success) {
          throw new TrainingBusinessException(
            'Training archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: TRAINING_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.TRAININGS,
          details: JSON.stringify({
            id,
            employee_id: training.employee_id,
            training_date: getPHDateTime(training.training_date),
            trainings_cert_id: training.trainings_cert_id,
            training_title: training.training_title,
            explanation: `Training with ID : ${id} archived by USER : ${requestInfo?.user_name || ''
              }`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(training.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
