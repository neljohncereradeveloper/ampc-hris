import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { ProvinceRepository } from '@/features/201-management/domain/repositories';
import {
  PROVINCE_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class ComboboxProvinceUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.PROVINCE)
    private readonly provinceRepository: ProvinceRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      PROVINCE_ACTIONS.COMBOBOX,
      async (manager) => {
        const provinces = await this.provinceRepository.combobox(manager);
        return provinces.map((province: { desc1: string }) => ({
          value: province.desc1 || '',
          label: province.desc1
            ? province.desc1.charAt(0).toUpperCase() +
              province.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
