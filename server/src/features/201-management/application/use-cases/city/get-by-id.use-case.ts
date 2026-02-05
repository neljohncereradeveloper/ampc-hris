import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { CityRepository } from '@/features/201-management/domain/repositories';
import {
  CITY_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';
import { City } from '@/features/201-management/domain/models';
import { HTTP_STATUS } from '@/core/domain/constants';
import { CityBusinessException } from '@/features/201-management/domain/exceptions';

@Injectable()
export class GetCityByIdUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.CITY)
    private readonly cityRepository: CityRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(id: number): Promise<City> {
    return this.transactionHelper.executeTransaction(
      CITY_ACTIONS.PAGINATED_LIST,
      async (manager) => {
        const city = await this.cityRepository.findById(id, manager);
        if (!city) {
          throw new CityBusinessException(
            `City with ID ${id} not found.`,
            HTTP_STATUS.NOT_FOUND,
          );
        }
        return city;
      },
    );
  }
}
