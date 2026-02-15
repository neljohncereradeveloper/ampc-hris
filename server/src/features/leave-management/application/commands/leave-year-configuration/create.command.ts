/**
 * Command for creating a leave year configuration.
 */
export interface CreateLeaveYearConfigurationCommand {
  /** Start date of the leave year (e.g. Jan 1). */
  cutoff_start_date: Date;
  /** End date of the leave year (e.g. Dec 31). */
  cutoff_end_date: Date;
  /** Leave year label (e.g. "2025"). */
  year: string;
  /** Optional notes. */
  remarks?: string;
}
