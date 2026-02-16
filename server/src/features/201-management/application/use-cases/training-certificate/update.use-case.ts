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
import { UpdateTrainingCertificateCommand } from '../../commands/training-certificate/update-training-certificate.command';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

@Injectable()
export class UpdateTrainingCertificateUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(MANAGEMENT_201_TOKENS.TRAINING_CERTIFICATE)
    private readonly trainingCertificateRepository: TrainingCertificateRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  async execute(
    id: number,
    command: UpdateTrainingCertificateCommand,
    requestInfo?: RequestInfo,
  ): Promise<TrainingCertificate | null> {
    return this.transactionHelper.executeTransaction(
      TRAINING_CERTIFICATE_ACTIONS.UPDATE,
      async (manager) => {
        const certificate = await this.trainingCertificateRepository.findById(
          id,
          manager,
        );
        if (!certificate) {
          throw new TrainingCertificateBusinessException(
            'Training certificate not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }

        const tracking_config: FieldExtractorConfig[] = [
          { field: 'certificate_name' },
          { field: 'issuing_organization' },
          {
            field: 'issue_date',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          {
            field: 'expiry_date',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'certificate_number' },
          { field: 'file_path' },
          {
            field: 'updated_at',
            transform: (val) => (val ? getPHDateTime(val) : null),
          },
          { field: 'updated_by' },
        ];

        const before_state = extractEntityState(certificate, tracking_config);

        certificate.update({
          certificate_name: command.certificate_name,
          issuing_organization: command.issuing_organization,
          issue_date: command.issue_date,
          expiry_date: command.expiry_date,
          certificate_number: command.certificate_number,
          file_path: command.file_path,
          updated_by: requestInfo?.user_name || null,
        });

        const success = await this.trainingCertificateRepository.update(
          id,
          certificate,
          manager,
        );
        if (!success) {
          throw new TrainingCertificateBusinessException(
            'Training certificate update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result =
          await this.trainingCertificateRepository.findById(id, manager);
        const after_state = extractEntityState(updated_result, tracking_config);
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: TRAINING_CERTIFICATE_ACTIONS.UPDATE,
          entity: MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES,
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
