import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import { getPHDateTime } from '@/core/utils/date.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { HTTP_STATUS } from '@/core/domain/constants';
import { TrainingCertificateBusinessException } from '@/features/201-management/domain/exceptions';
import { TrainingCertificate } from '@/features/201-management/domain/models';
import { TrainingCertificateRepository } from '@/features/201-management/domain/repositories';
import {
  TRAINING_CERTIFICATE_ACTIONS,
  MANAGEMENT_201_TOKENS,
  MANAGEMENT_201_DATABASE_MODELS,
} from '@/features/201-management/domain/constants';
import { CreateTrainingCertificateCommand } from '../../commands/training-certificate/create-training-certificate.command';

@Injectable()
export class CreateTrainingCertificateUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.TRAINING_CERTIFICATE)
    private readonly trainingCertificateRepository: TrainingCertificateRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    command: CreateTrainingCertificateCommand,
    requestInfo?: RequestInfo,
  ): Promise<TrainingCertificate> {
    return this.transactionHelper.executeTransaction(
      TRAINING_CERTIFICATE_ACTIONS.CREATE,
      async (manager) => {
        const new_certificate = TrainingCertificate.create({
          certificate_name: command.certificate_name,
          issuing_organization: command.issuing_organization,
          issue_date: command.issue_date,
          expiry_date: command.expiry_date,
          certificate_number: command.certificate_number,
          file_path: command.file_path,
          created_by: requestInfo?.user_name || null,
        });

        const created_certificate = await this.trainingCertificateRepository.create(
          new_certificate,
          manager,
        );

        if (!created_certificate) {
          throw new TrainingCertificateBusinessException(
            'Training certificate creation failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const log = ActivityLog.create({
          action: TRAINING_CERTIFICATE_ACTIONS.CREATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES,
          details: JSON.stringify({
            id: created_certificate.id,
            certificate_name: created_certificate.certificate_name,
            issuing_organization: created_certificate.issuing_organization,
            issue_date: getPHDateTime(created_certificate.issue_date),
            expiry_date: created_certificate.expiry_date ? getPHDateTime(created_certificate.expiry_date) : null,
            certificate_number: created_certificate.certificate_number,
            created_by: requestInfo?.user_name || '',
            created_at: getPHDateTime(created_certificate.created_at),
          }),
          request_info: requestInfo || { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return created_certificate;
      },
    );
  }
}
