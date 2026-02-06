import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { TrainingBusinessException } from '@/features/201-management/domain/exceptions';
import { Training } from '@/features/201-management/domain/models';
import { TrainingRepository, TrainingCertificateRepository } from '@/features/201-management/domain/repositories';
import {
  TRAINING_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { UpdateTrainingCommand } from '../../commands/training/update-training.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateTrainingUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.TRAINING)
    private readonly trainingRepository: TrainingRepository,
    @Inject(MANAGEMENT_201_TOKENS.TRAINING_CERTIFICATE)
    private readonly trainingCertificateRepository: TrainingCertificateRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateTrainingCommand,
    requestInfo?: RequestInfo,
  ): Promise<Training | null> {
    return this.transactionHelper.executeTransaction(
      TRAINING_ACTIONS.UPDATE,
      async (manager) => {
        const training = await this.trainingRepository.findById(
          id,
          manager,
        );
        if (!training) {
          throw new TrainingBusinessException(
            'Training not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        // Validate training certificate exists
        const trainingCertificate = await this.trainingCertificateRepository.findById(
          command.trainings_cert_id,
          manager,
        );
        if (!trainingCertificate) {
          throw new TrainingBusinessException(
            `Training certificate with ID ${command.trainings_cert_id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          {
            field: 'training_date',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'trainings_cert_id' },
          { field: 'training_title' },
          { field: 'desc1' },
          { field: 'image_path' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(training, tracking_config);

        training.update({
          training_date: command.training_date,
          trainings_cert_id: command.trainings_cert_id,
          training_title: command.training_title,
          desc1: command.desc1,
          image_path: command.image_path,
          updated_by: requestInfo?.user_name || null,
        });

        const success = await this.trainingRepository.update(
          id,
          training,
          manager,
        );
        if (!success) {
          throw new TrainingBusinessException(
            'Training update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.trainingRepository.findById(
          id,
          manager,
        );
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: TRAINING_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.TRAININGS,
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
