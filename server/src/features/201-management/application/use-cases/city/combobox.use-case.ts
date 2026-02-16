import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { CityRepository } from '@/features/201-management/domain/repositories';
import {
  CITY_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxCityUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.CITY)
    private readonly cityRepository: CityRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      CITY_ACTIONS.COMBOBOX,
      async (manager) => {
        const cities = await this.cityRepository.combobox(manager);
        return cities.map((city: { desc1: string }) => ({
          value: city.desc1 || '',
          label: city.desc1
            ? city.desc1.charAt(0).toUpperCase() +
              city.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
