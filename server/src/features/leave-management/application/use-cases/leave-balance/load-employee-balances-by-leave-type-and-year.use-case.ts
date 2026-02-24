import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveBalance } from '@/features/leave-management/domain/models';
import { LeaveBalanceRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_BALANCE_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { LeaveTypeRepository } from '@/features/shared-domain/domain/repositories';
import { SHARED_DOMAIN_TOKENS } from '@/features/shared-domain/domain/constants';
import { LeaveBalanceBusinessException } from '@/features/leave-management/domain';

/**
 * Retrieves the leave balance for a specific employee and leave type.
 */
@Injectable()
export class LoadEmployeeBalancesByLeaveTypeAndYearUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly repo: LeaveBalanceRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(SHARED_DOMAIN_TOKENS.LEAVE_TYPE)
    private readonly leaveTypeRepository: LeaveTypeRepository,
  ) {}

  /**
   * Retrieves the leave balance for a specific employee and leave type.
   *
   * @param employee_id - The unique identifier of the employee whose leave balance will be retrieved.
   * @param leave_type_code - The code of the leave type whose balance will be retrieved.
   * @param year - The specific year for which the leave balance is requested.
   * @returns {Promise<LeaveBalance | null>} - The leave balance or null if not found.
   */
  async execute(
    employee_id: number,
    leave_type_code: string,
    year: string,
  ): Promise<LeaveBalance | null> {
    return this.transactionHelper.executeTransaction(
      LEAVE_BALANCE_ACTIONS.GET_BY_LEAVE_TYPE,
      async (manager) => {
        // Fetch the leave type by code first to get the ID
        const leaveType = await this.leaveTypeRepository.findByCode(
          leave_type_code,
          manager,
        );
        if (!leaveType) {
          throw new LeaveBalanceBusinessException(
            `Leave type with code "${leave_type_code}" not found`,
          );
        }
        // Use the retrieved leave_type_id to get the balance
        const result = await this.repo.loadEmployeeBalancesByLeaveTypeAndYear(
          employee_id,
          Number(leaveType.id),
          year,
          manager,
        );
        return result;
      },
    );
  }
}
