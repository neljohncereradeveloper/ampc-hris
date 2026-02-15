import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE, HTTP_STATUS } from '@/core/domain/constants';
import { ActivityLogRepository } from '@/core/domain/repositories';
import { RequestInfo } from '@/core/utils/request-info.util';
import {
  getPHDateTime,
  isSameCalendarDay,
  getCalendarDaysInclusive,
  formatDate,
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
import {
  HolidayRepository,
  EmployeeRepository,
} from '@/features/shared-domain/domain/repositories';
import { SHARED_DOMAIN_TOKENS } from '@/features/shared-domain/domain/constants';
import type { Holiday } from '@/features/shared-domain/domain/models/holiday.model';
import {
  getChangedFields,
  extractEntityState,
  FieldExtractorConfig,
} from '@/core/utils/change-tracking.util';

/** Detail about excluded weekdays found in a date range (for validation errors). */
export interface ExcludedWeekdayDetail {
  /** First weekday number found (0=Sunday, ..., 6=Saturday) for DAY_NAMES. */
  firstExcludedDay: number;
  /** All dates in the range that fall on excluded weekdays. */
  excludedDates: Date[];
}

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
    @Inject(SHARED_DOMAIN_TOKENS.EMPLOYEE)
    private readonly employeeRepository: EmployeeRepository,
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
        /** Only PENDING requests can be updated. */
        if (existing_request.status !== EnumLeaveRequestStatus.PENDING) {
          throw new LeaveRequestBusinessException(
            `Cannot update request. Current status: ${existing_request.status}. Only PENDING requests can be updated.`,
            HTTP_STATUS.CONFLICT,
          );
        }

        /** Resolve employee name for activity log. */
        const employee = await this.employeeRepository.findById(
          Number(existing_request.employee_id),
          manager,
        );
        const employee_name =
          employee && !employee.deleted_at
            ? `${employee.first_name} ${employee.last_name}`
            : '';

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
          /** Ensure the leave period is valid: start date on or before end date. */
          this.validateDates(start_date, end_date);

          const is_same_day = isSameCalendarDay(start_date, end_date);
          /** Half-day leave requires start and end date to be the same. */
          if (command.is_half_day && !is_same_day) {
            throw new LeaveRequestBusinessException(
              'Half-day leave requires start date and end date to be the same',
              HTTP_STATUS.BAD_REQUEST,
            );
          }

          /** Get active leave policy for the request's leave type. */
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

          /** Validate that the leave period does not include excluded weekdays. */
          let holidays: Holiday[] = [];
          const excluded_weekdays = policy.excluded_weekdays ?? [];
          if (excluded_weekdays.length > 0) {
            const excluded_detail = this.getExcludedWeekdayDetailsInRange(
              start_date,
              end_date,
              excluded_weekdays,
            );
            if (excluded_detail !== null) {
              const day_name = DAY_NAMES[excluded_detail.firstExcludedDay];
              const dates_str =
                excluded_detail.excludedDates.length > 0
                  ? ` (${excluded_detail.excludedDates.map((d) => formatDate(d)).join(', ')})`
                  : '';
              throw new LeaveRequestBusinessException(
                `Cannot file leave on excluded weekdays. The selected date range includes ${day_name}${dates_str}, which is excluded by the leave policy.`,
                HTTP_STATUS.BAD_REQUEST,
              );
            }
          }

          /**
           * Calculate total days between start and end (inclusive), excluding holidays and policy excluded_weekdays.
           * Use 0.5 for half-day when start and end are the same day.
           */
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

          /** Validate that the total days is greater than 0. */
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

          /** When total_days changed, validate that the balance is sufficient and open. */
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

          /**
           * Validate that there are no overlapping leave requests (only PENDING/APPROVED block; REJECTED/CANCELLED do not).
           * Exclude the current request by id when checking.
           *
           * Future: If half-day "slots" (e.g. AM vs PM on the same day) are supported, overlap logic should allow
           * two half-days on the same day when slots differ. With the current "same date range = one request" rule,
           * the logic is correct as-is.
           */
          const overlapping = await this.leaveRequestRepository.findOverlappingRequests(
            Number(existing_request.employee_id),
            start_date,
            end_date,
            manager,
            request_id,
          );
          const blocking = overlapping.filter(
            (r) =>
              r.status === EnumLeaveRequestStatus.PENDING ||
              r.status === EnumLeaveRequestStatus.APPROVED,
          );
          if (blocking.length > 0) {
            const dateRanges = blocking
              .map(
                (r) =>
                  `${formatDate(r.start_date)} – ${formatDate(r.end_date)}`,
              )
              .join('; ');
            throw new LeaveRequestBusinessException(
              `Overlapping leave request exists for this period. Conflicting request(s): ${dateRanges}.`,
              HTTP_STATUS.CONFLICT,
            );
          }
        }

        /** Apply updates to the domain model (dates, total_days, reason, remarks, updated_by). */
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

        /** Persist the updated leave request. */
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

        /** Log the update with changed fields and request context. */
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
   * Converts command input (string, number, or Date) to a valid Date for start_date/end_date.
   * Uses core toDate() for conversion; throws domain exception with label for required/invalid.
   *
   * Process:
   * 1. If value is null/undefined, throw "label is required".
   * 2. Call toDate(value); if null (invalid), throw "Invalid label".
   * 3. Return the Date.
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

  /**
   * Ensures the leave period is valid: start date must be on or before end date.
   * Compares date-only (no time) by building midnight dates from year/month/day.
   */
  private validateDates(start_date: Date, end_date: Date): void {
    const startDay = new Date(
      start_date.getFullYear(),
      start_date.getMonth(),
      start_date.getDate(),
    ).getTime();
    const endDay = new Date(
      end_date.getFullYear(),
      end_date.getMonth(),
      end_date.getDate(),
    ).getTime();
    if (startDay > endDay) {
      throw new LeaveRequestBusinessException(
        'Start date must be before or equal to end date',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }

  /**
   * Calculates the number of leave days in a date range: calendar days minus holidays and policy excluded weekdays.
   * Used when updating dates (full-day leave). Half-day leave uses 0.5 and does not call this.
   */
  private async calculateTotalDaysWithHolidays(
    start_date: Date,
    end_date: Date,
    policy: LeavePolicy,
    manager: unknown,
  ): Promise<{ total_days: number; holidays: Holiday[] }> {
    const calendar_days = getCalendarDaysInclusive(start_date, end_date);
    const start = new Date(start_date);
    const end = new Date(end_date);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
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

  /**
   * Count excluded weekdays in range. Days that are holidays are not counted to avoid double-counting.
   * @param excluded_weekdays - 0=Sunday, 1=Monday, ..., 6=Saturday
   */
  private countExcludedWeekdays(
    start_date: Date,
    end_date: Date,
    excluded_weekdays: number[],
    holidays: Holiday[],
  ): number {
    if (!excluded_weekdays.length) return 0;
    let count = 0;
    const current = new Date(start_date);
    while (current <= end_date) {
      const day = current.getDay();
      if (excluded_weekdays.includes(day)) {
        const is_holiday = holidays.some((h) => {
          const holidayDate = toDate(h.date);
          return holidayDate !== null && isSameCalendarDay(holidayDate, current);
        });
        if (!is_holiday) count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  }

  /**
   * Returns detailed info about excluded weekdays in the date range, or null if none.
   * Sunday = 0; validation correctly handles 0 in excluded_weekdays.
   *
   * @returns Object with firstExcludedDay (0-6) and excludedDates (all dates in range on excluded weekdays), or null
   */
  private getExcludedWeekdayDetailsInRange(
    start_date: Date,
    end_date: Date,
    excluded_weekdays: number[],
  ): ExcludedWeekdayDetail | null {
    if (!excluded_weekdays.length) return null;
    const excludedDates: Date[] = [];
    let firstExcludedDay: number | null = null;
    const current = new Date(start_date);
    while (current <= end_date) {
      const day = current.getDay();
      if (excluded_weekdays.includes(day)) {
        excludedDates.push(new Date(current));
        if (firstExcludedDay === null) firstExcludedDay = day;
      }
      current.setDate(current.getDate() + 1);
    }
    if (firstExcludedDay === null) return null;
    return { firstExcludedDay, excludedDates };
  }
}
