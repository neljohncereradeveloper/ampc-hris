import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import {
  getPHDateTime,
  isSameCalendarDay,
  getCalendarDaysInclusive,
} from '@/core/utils/date.util';
import { toDate } from '@/core/utils/coercion.util';
import { ActivityLog } from '@/core/domain/models';
import { TransactionPort } from '@/core/domain/ports';
import { LeaveRequestBusinessException } from '@/features/leave-management/domain/exceptions';
import { LeaveRequest } from '@/features/leave-management/domain/models';
import {
  LeaveRequestRepository,
  LeaveBalanceRepository,
  LeavePolicyRepository,
} from '@/features/leave-management/domain/repositories';
import { LeavePolicy } from '@/features/leave-management/domain/models/leave-policy.model';
import {
  DAY_NAMES,
  LEAVE_MANAGEMENT_DATABASE_MODELS,
  LEAVE_MANAGEMENT_TOKENS,
  LEAVE_REQUEST_ACTIONS,
} from '@/features/leave-management/domain/constants';
import { UpdateLeaveRequestCommand } from '../../commands/leave-request/update-leave-request.command';
import {
  EnumLeaveRequestStatus,
  EnumLeaveBalanceStatus,
} from '@/features/leave-management/domain/enum';
import { HolidayRepository } from '@/features/shared-domain/domain/repositories';
import { SHARED_DOMAIN_TOKENS } from '@/features/shared-domain/domain/constants';
import type { Holiday } from '@/features/shared-domain/domain/models/holiday.model';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';



@Injectable()
export class UpdateLeaveRequestUseCase {
  constructor(
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_REQUEST)
    private readonly leaveRequestRepository: LeaveRequestRepository,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_BALANCE)
    private readonly leaveBalanceRepository: LeaveBalanceRepository,
    @Inject(LEAVE_MANAGEMENT_TOKENS.LEAVE_POLICY)
    private readonly leavePolicyRepository: LeavePolicyRepository,
    @Inject(SHARED_DOMAIN_TOKENS.HOLIDAY)
    private readonly holidayRepository: HolidayRepository,
    @Inject(TOKENS_CORE.ACTIVITYLOGS)
    private readonly activityLogRepository: ActivityLogRepository,
  ) { }

  async execute(
    id: number,
    command: UpdateLeaveRequestCommand,
    requestInfo?: RequestInfo,
  ): Promise<LeaveRequest | null> {
    const request_id = Number(id);
    const tracking_config: FieldExtractorConfig[] = [
      { field: 'start_date' },
      { field: 'end_date' },
      { field: 'total_days' },
      { field: 'reason' },
      {
        field: 'updated_at',
        transform: (val: unknown) => (val ? getPHDateTime(val as Date) : null),
      },
      { field: 'updated_by' },
    ];

    return this.transactionHelper.executeTransaction(
      LEAVE_REQUEST_ACTIONS.UPDATE,
      async (manager) => {
        const existing_request = await this.leaveRequestRepository.findById(
          request_id,
          manager,
        );
        if (!existing_request) {
          throw new LeaveRequestBusinessException(
            'Leave request not found',
            HTTP_STATUS.NOT_FOUND,
          );
        }
        if (existing_request.status !== EnumLeaveRequestStatus.PENDING) {
          throw new LeaveRequestBusinessException(
            `Cannot update request. Current status: ${existing_request.status}. Only PENDING requests can be updated.`,
            HTTP_STATUS.CONFLICT,
          );
        }

        const before_state = extractEntityState(
          existing_request,
          tracking_config,
        );

        let start_date = existing_request.start_date;
        let end_date = existing_request.end_date;
        let total_days = existing_request.total_days;
        const dates_updated = command.start_date != null || command.end_date != null;

        if (dates_updated) {
          start_date = this.normalizeDate(
            command.start_date ?? existing_request.start_date,
            'Start date',
          );
          end_date = this.normalizeDate(
            command.end_date ?? existing_request.end_date,
            'End date',
          );
          this.validateDates(start_date, end_date);

          const policy = await this.leavePolicyRepository.getActivePolicy(
            Number(existing_request.leave_type_id),
            manager,
          );
          if (!policy) {
            throw new LeaveRequestBusinessException(
              `Active leave policy not found for leave type ID ${existing_request.leave_type_id}`,
              HTTP_STATUS.NOT_FOUND,
            );
          }

          let holidays: Holiday[] = [];
          const is_same_day =
            isSameCalendarDay(start_date, end_date);
          const excluded_weekdays = policy.excluded_weekdays ?? [];

          if (excluded_weekdays.length > 0) {
            if (this.hasExcludedWeekday(start_date, end_date, excluded_weekdays)) {
              const day_of_week = start_date.getDay();
              throw new LeaveRequestBusinessException(
                `Cannot file leave on excluded weekdays. The selected date range includes ${DAY_NAMES[day_of_week]} which is excluded by the leave policy.`,
                HTTP_STATUS.BAD_REQUEST,
              );
            }
          }

          if (command.is_half_day && is_same_day) {
            total_days = 0.5;
            holidays = await this.holidayRepository.findByDateRange(
              start_date,
              end_date,
              manager,
            );
          } else {
            const result = await this.calculateTotalDaysWithHolidays(
              start_date,
              end_date,
              policy,
              manager,
            );
            total_days = result.total_days;
            holidays = result.holidays;
          }

          if (total_days <= 0) {
            const calendar_days = getCalendarDaysInclusive(start_date, end_date);
            if (holidays.length >= calendar_days) {
              throw new LeaveRequestBusinessException(
                'All dates in the leave request period are holidays. Cannot update leave request for holiday dates only.',
                HTTP_STATUS.BAD_REQUEST,
              );
            }
            throw new LeaveRequestBusinessException(
              'Invalid date range: total days must be greater than 0. The selected dates may fall on holidays or excluded weekdays.',
              HTTP_STATUS.BAD_REQUEST,
            );
          }

          if (command.is_half_day && !is_same_day) {
            throw new LeaveRequestBusinessException(
              'Half-day leave requires start date and end date to be the same',
              HTTP_STATUS.BAD_REQUEST,
            );
          }

          if (total_days !== existing_request.total_days) {
            const balance_to_check = await this.leaveBalanceRepository.findById(
              Number(existing_request.balance_id),
              manager,
            );
            if (!balance_to_check) {
              throw new LeaveRequestBusinessException(
                'Leave balance not found',
                HTTP_STATUS.NOT_FOUND,
              );
            }
            if (balance_to_check.status !== EnumLeaveBalanceStatus.OPEN) {
              throw new LeaveRequestBusinessException(
                'Cannot update request. Balance is closed.',
                HTTP_STATUS.BAD_REQUEST,
              );
            }
            if (Number(balance_to_check.remaining) < total_days) {
              throw new LeaveRequestBusinessException(
                `Insufficient leave balance. Available: ${balance_to_check.remaining} days, Requested: ${total_days} days`,
                HTTP_STATUS.BAD_REQUEST,
              );
            }
          }

          const overlapping = await this.leaveRequestRepository.findOverlappingRequests(
            Number(existing_request.employee_id),
            start_date,
            end_date,
            manager,
            request_id,
          );
          const has_overlap = overlapping.some(
            (r) =>
              r.status === EnumLeaveRequestStatus.PENDING ||
              r.status === EnumLeaveRequestStatus.APPROVED,
          );
          if (has_overlap) {
            throw new LeaveRequestBusinessException(
              'Overlapping leave request exists for this period.',
              HTTP_STATUS.CONFLICT,
            );
          }
        }

        existing_request.update({
          start_date: dates_updated ? start_date : undefined,
          end_date: dates_updated ? end_date : undefined,
          total_days:
            dates_updated && total_days !== existing_request.total_days
              ? total_days
              : undefined,
          reason: command.reason,
          remarks: command.remarks,
          updated_by: requestInfo?.user_name ?? null,
        });

        const success = await this.leaveRequestRepository.update(
          request_id,
          existing_request,
          manager,
        );
        if (!success) {
          throw new LeaveRequestBusinessException(
            'Leave request update failed',
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
          );
        }

        const updated_result = await this.leaveRequestRepository.findById(
          request_id,
          manager,
        );
        const after_state = extractEntityState(
          updated_result ?? existing_request,
          tracking_config,
        );
        const changed_fields = getChangedFields(before_state, after_state);

        const log = ActivityLog.create({
          action: LEAVE_REQUEST_ACTIONS.UPDATE,
          entity: LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_REQUESTS,
          details: JSON.stringify({
            id: updated_result?.id,
            changed_fields,
            updated_by: requestInfo?.user_name ?? '',
            updated_at: getPHDateTime(
              updated_result?.updated_at ?? new Date(),
            ),
          }),
          request_info: requestInfo ?? { user_name: '' },
        });
        await this.activityLogRepository.create(log, manager);

        return updated_result;
      },
    );
  }

  /**
   * Converts command input to a valid Date using core toDate(); throws with label for required/invalid.
   */
  private normalizeDate(value: unknown, label: string): Date {
    if (value == null) {
      throw new LeaveRequestBusinessException(
        `${label} is required`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    const d = toDate(value);
    if (d === null) {
      throw new LeaveRequestBusinessException(
        `Invalid ${label.toLowerCase()}`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }
    return d;
  }

  private validateDates(start_date: Date, end_date: Date): void {
    const start = new Date(start_date);
    const end = new Date(end_date);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    if (start.getTime() > end.getTime()) {
      throw new LeaveRequestBusinessException(
        'Start date must be before or equal to end date',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }

  private async calculateTotalDaysWithHolidays(
    start_date: Date,
    end_date: Date,
    policy: LeavePolicy,
    manager: unknown,
  ): Promise<{ total_days: number; holidays: Holiday[] }> {
    const start = new Date(start_date);
    const end = new Date(end_date);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const calendar_days = getCalendarDaysInclusive(start, end);
    const holidays = await this.holidayRepository.findByDateRange(
      start,
      end,
      manager,
    );
    const excluded_weekday_count = this.countExcludedWeekdays(
      start,
      end,
      policy.excluded_weekdays ?? [],
      holidays,
    );
    const total_days = Math.max(
      0,
      calendar_days - holidays.length - excluded_weekday_count,
    );
    return { total_days, holidays };
  }

  private countExcludedWeekdays(
    start_date: Date,
    end_date: Date,
    excluded_weekdays: number[],
    holidays: Holiday[],
  ): number {
    if (!excluded_weekdays.length) return 0;
    let count = 0;
    const current = new Date(start_date);
    const end = new Date(end_date);
    while (current <= end) {
      const day = current.getDay();
      if (excluded_weekdays.includes(day)) {
        const is_holiday = holidays.some((h) =>
          isSameCalendarDay(new Date(h.date), current),
        );
        if (!is_holiday) count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  }

  private hasExcludedWeekday(
    start_date: Date,
    end_date: Date,
    excluded_weekdays: number[],
  ): boolean {
    if (!excluded_weekdays.length) return false;
    const current = new Date(start_date);
    const end = new Date(end_date);
    while (current <= end) {
      if (excluded_weekdays.includes(current.getDay())) return true;
      current.setDate(current.getDate() + 1);
    }
    return false;
  }

}
