import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { JobtitleRepository } from '@/features/shared-domain/domain/repositories';
import {
  JOBTITLE_ACTIONS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { Jobtitle } from '@/features/shared-domain/domain/models';

@Injectable()
export class GetPaginatedJobtitleUseCase {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.JOBTITLE)
    private readonly jobtitleRepository: JobtitleRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<Jobtitle>> {
    return this.transactionHelper.executeTransaction(
      JOBTITLE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const jobtitles = await this.jobtitleRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return jobtitles;
      },
    );
  }
}
