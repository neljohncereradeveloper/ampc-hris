import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { TrainingRepository } from '@/features/201-management/domain/repositories';
import {
  TRAINING_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { Training } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedTrainingUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.TRAINING)
    private readonly trainingRepository: TrainingRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    employee_id: number,
  ): Promise<PaginatedResult<Training>> {
    return this.transactionHelper.executeTransaction(
      TRAINING_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const trainings = await this.trainingRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          employee_id,
          manager,
        );
        return trainings;
      },
    );
  }
}
