import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
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
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class ArchiveTrainingCertificateUseCase {
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
      TRAINING_CERTIFICATE_ACTIONS.ARCHIVE,
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

        certificate.archive(requestInfo?.user_name || '');

        const success = await this.trainingCertificateRepository.update(
          id,
          certificate,
          manager,
        );
        if (!success) {
          throw new TrainingCertificateBusinessException(
            'Training certificate archive failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: TRAINING_CERTIFICATE_ACTIONS.ARCHIVE,
          entity: MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES,
          details: JSON.stringify({
            id,
            certificate_name: certificate.certificate_name,
            issuing_organization: certificate.issuing_organization,
            explanation: `Training certificate with ID : ${id} archived by USER : ${
              requestInfo?.user_name || ''
            }`,
            archived_by: requestInfo?.user_name || '',
            archived_at: getPHDateTime(certificate.deleted_at || new Date()),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return true;
      },
    );
  }
}
