import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { TrainingCertificateBusinessException } from '@/features/201-management/domain/exceptions';
import { TrainingCertificateRepository } from '@/features/201-management/domain/repositories';
import {
  TRAINING_CERTIFICATE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class RestoreTrainingCertificateUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.TRAINING_CERTIFICATE)
    private readonly trainingCertificateRepository: TrainingCertificateRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(id: number, requestInfo?: RequestInfo): Promise<boolean> {
    return this.transactionHelper.executeTransaction(
      TRAINING_CERTIFICATE_ACTIONS.RESTORE,
      async (manager) => {
        const certificate = await this.trainingCertificateRepository.findById(
          id,
          manager,
        );
        if (!certificate) {
          throw new TrainingCertificateBusinessException(
            `Training certificate with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }

        certificate.restore();

        const success = await this.trainingCertificateRepository.update(
          id,
          certificate,
          manager,
        );
        if (!success) {
          throw new TrainingCertificateBusinessException(
            'Training certificate restore failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: TRAINING_CERTIFICATE_ACTIONS.RESTORE,
          entity: MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES,
          details: JSON.stringify({
            id,
            certificate_name: certificate.certificate_name,
            issuing_organization: certificate.issuing_organization,
            explanation: `Training certificate with ID : ${id} restored by USER : ${
              requestInfo?.user_name || ''
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
