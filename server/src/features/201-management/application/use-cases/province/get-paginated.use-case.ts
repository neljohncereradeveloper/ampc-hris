import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { ProvinceRepository } from '@/features/201-management/domain/repositories';
import {
  PROVINCE_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { Province } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedProvinceUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.PROVINCE)
    private readonly provinceRepository: ProvinceRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<Province>> {
    return this.transactionHelper.executeTransaction(
      PROVINCE_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const provinces = await this.provinceRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return provinces;
      },
    );
  }
}
