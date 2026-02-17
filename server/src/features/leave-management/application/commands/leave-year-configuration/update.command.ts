/**
 * Command for updating a leave year configuration.
 */
export interface UpdateLeaveYearConfigurationCommand {
  /** New start date of the leave year. */
  cutoff_start_date: Date;
  /** New end date of the leave year. */
  cutoff_end_date: Date;
  /** New leave year label. */
  year: string;
  /** Optional notes. */
  remarks?: string;
}
