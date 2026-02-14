/**
 * Command for creating a leave year configuration.
 */
export interface CreateLeaveYearConfigurationCommand {
  cutoff_start_date: Date;
  cutoff_end_date: Date;
  year: string;
  remarks?: string;
}
