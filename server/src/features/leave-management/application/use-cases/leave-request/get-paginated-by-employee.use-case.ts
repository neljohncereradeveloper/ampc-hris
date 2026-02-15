import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveRequestRepository } from '@/features/leave-management/domain/repositories';
import {
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_REQUEST_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { LeaveRequest } from '@/features/leave-management/domain/models';

@Injectable()
export class GetPaginatedLeaveRequestByEmployeeUseCase {
  constructor(
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_REQUEST)
    private readonly leaveRequestRepository: LeaveRequestRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    employee_id: number,
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
  ): Promise<PaginatedResult<LeaveRequest>> {
    const employee_id_num = Number(employee_id);
    const page_num = Number(page) || 1;
    const limit_num = Number(limit) || 10;
    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.PAGINATED_LIST_BY_EMPLOYEE,
      async (manager) =>
        this.leaveRequestRepository.findPaginatedByEmployee(
          employee_id_num,
          term,
          page_num,
          limit_num,
          is_archived,
          manager,
        ),
    );
  }
}
