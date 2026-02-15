import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveYearConfigurationRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_YEAR_CONFIGURATION_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveYearConfiguration } from '@/features/leave-management/domain/models';

@Injectable()
export class GetPaginatedLeaveYearConfigurationUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION)
    private readonly repo: LeaveYearConfigurationRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<LeaveYearConfiguration>> {
    return this.transactionHelper.executeTransaction(
      LEAVE_YEAR_CONFIGURATION_ACTIONS.PAGINATED_LIST,
      async (manager) =>
        this.repo.findPaginatedList(term, page, limit, is_archived, manager),
    );
  }
}
