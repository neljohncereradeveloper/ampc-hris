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
import { CreateTrainingCommand } from '../../commands/training/create-training.command';

@Injectable()
export class CreateTrainingUseCase {
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
    command: CreateTrainingCommand,
    requestInfo?: RequestInfo,
  ): Promise<Training> {
    return this.transactionHelper.executeTransaction(
      TRAINING_ACTIONS.CREATE,
      async (manager) => {
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

        const new_training = Training.create({
          employee_id: command.employee_id,
          training_date: command.training_date,
          trainings_cert_id: command.trainings_cert_id,
          training_title: command.training_title,
          desc1: command.desc1,
          image_path: command.image_path,
          created_by: requestInfo?.user_name || null,
        });

        // Set trainings_certificate name from the certificate
        new_training.trainings_certificate = trainingCertificate.certificate_name;

        const created_training = await this.trainingRepository.create(
          new_training,
          manager,
        );

        if (!created_training) {
          throw new TrainingBusinessException(
            'Training creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: TRAINING_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.TRAININGS,
          details: JSON.stringify({
            id: created_training.id,
            employee_id: created_training.employee_id,
            training_date: getPHDateTime(created_training.training_date),
            trainings_cert_id: created_training.trainings_cert_id,
            training_title: created_training.training_title,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_training.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_training;
      },
    );
  }
}
