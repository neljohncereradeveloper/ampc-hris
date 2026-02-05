import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { BranchRepository } from '@/features/shared-domain/domain/repositories';
import {
  BRANCH_ACTIONS,
  SHARED_DOMAIN_TOKENS,
} from '@/features/shared-domain/domain/constants';

@Injectable()
export class ComboboxBranchUseCase {
  constructor(
    @Inject(SHARED_DOMAIN_TOKENS.BRANCH)
    private readonly branchRepository: BranchRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) { }

  async execute(): Promise<{ value: string; label: string }[]> {
    return this.transactionHelper.executeTransaction(
      BRANCH_ACTIONS.COMBOBOX,
      async (manager) => {
        const branches = await this.branchRepository.combobox(manager);
        return branches.map((branch: { desc1: string }) => ({
          value: branch.desc1 || '',
          label: branch.desc1
            ? branch.desc1.charAt(0).toUpperCase() +
            branch.desc1.slice(1).toLowerCase()
            : '',
        }));
      },
    );
  }
}
