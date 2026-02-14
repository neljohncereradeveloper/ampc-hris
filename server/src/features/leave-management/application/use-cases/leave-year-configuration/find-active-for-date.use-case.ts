import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveYearConfigurationRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_YEAR_CONFIGURATION_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { LeaveYearConfiguration } from '@/features/leave-management/domain/models';

@Injectable()
export class FindActiveLeaveYearForDateUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_YEAR_CONFIGURATION)
    private readonly repo: LeaveYearConfigurationRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(date: Date): Promise<LeaveYearConfiguration | null> {
    return this.transactionHelper.executeTransaction(
      LEAVE_YEAR_CONFIGURATION_ACTIONS.FIND_ACTIVE_FOR_DATE,
      async (manager) => this.repo.findActiveForDate(date, manager),
    );
  }
}
