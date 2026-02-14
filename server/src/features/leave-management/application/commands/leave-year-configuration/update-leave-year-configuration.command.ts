/**
 * Command for updating a leave year configuration.
 */
export interface UpdateLeaveYearConfigurationCommand {
  cutoff_start_date?: Date;
  cutoff_end_date?: Date;
  year?: string;
  remarks?: string;
}
