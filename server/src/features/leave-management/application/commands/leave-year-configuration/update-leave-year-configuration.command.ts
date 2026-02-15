/**
 * Command for updating a leave year configuration.
 */
export interface UpdateLeaveYearConfigurationCommand {
  /** New start date of the leave year (optional). */
  cutoff_start_date?: Date;
  /** New end date of the leave year (optional). */
  cutoff_end_date?: Date;
  /** New leave year label (optional). */
  year?: string;
  /** Optional notes. */
  remarks?: string;
}
