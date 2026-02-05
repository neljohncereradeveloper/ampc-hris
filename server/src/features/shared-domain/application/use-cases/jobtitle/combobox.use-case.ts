import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { JobtitleRepository } from '@/features/shared-domain/domain/repositories';
import {
  JOBTITLE_ACTIONS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';

@Injectable()
export class ComboboxJobtitleUseCase {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.JOBTITLE)
    private readonly jobtitleRepository: JobtitleRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      JOBTITLE_ACTIONS.COMBOBOX,
      async (manager) => {
        const jobtitles = await this.jobtitleRepository.combobox(manager);
        return jobtitles.map((jobtitle: { desc1: string }) => ({
          value: jobtitle.desc1 || '',
          label: jobtitle.desc1
            ? jobtitle.desc1.charAt(0).toUpperCase() +
              jobtitle.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
