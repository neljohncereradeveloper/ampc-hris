import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { TrainingCertificateRepository } from '@/features/201-management/domain/repositories';
import {
  TRAINING_CERTIFICATE_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxTrainingCertificateUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.TRAINING_CERTIFICATE)
    private readonly trainingCertificateRepository: TrainingCertificateRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      TRAINING_CERTIFICATE_ACTIONS.COMBOBOX,
      async (manager) => {
        const certificates =
          await this.trainingCertificateRepository.combobox(manager);
        return certificates.map((certificate) => ({
          value: certificate.certificate_name || '',
          label: certificate.certificate_name
            ? `${certificate.certificate_name} - ${certificate.issuing_organization}`
            : '',
        }));
      },
    );
  }
}
