import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { TrainingCertificateRepository } from '@/features/201-management/domain/repositories';
import {
  TRAINING_CERTIFICATE_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { TrainingCertificate } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedTrainingCertificateUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.TRAINING_CERTIFICATE)
    private readonly trainingCertificateRepository: TrainingCertificateRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<TrainingCertificate>> {
    return this.transactionHelper.executeTransaction(
      TRAINING_CERTIFICATE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const certificates = await this.trainingCertificateRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return certificates;
      },
    );
  }
}
