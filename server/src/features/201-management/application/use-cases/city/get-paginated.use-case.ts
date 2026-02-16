import { Injectable, Inject } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { CityRepository } from '@/features/201-management/domain/repositories';
import {
  CITY_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { City } from '@/features/201-management/domain/models';

@Injectable()
export class GetPaginatedCityUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.CITY)
    private readonly cityRepository: CityRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<City>> {
    return this.transactionHelper.executeTransaction(
      CITY_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const cities = await this.cityRepository.findPaginatedList(
          term,
          page,
          limit,
          is_archived,
          manager,
        );
        return cities;
      },
    );
  }
}
