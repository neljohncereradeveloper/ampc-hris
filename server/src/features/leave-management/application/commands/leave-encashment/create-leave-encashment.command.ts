/**
 * Command for creating a leave encashment (status PENDING).
 */
export interface CreateLeaveEncashmentCommand {
  /** Employee whose leave is being encashed. */
  employee_id: number;
  /** Leave balance record to debit for this encashment. */
  balance_id: number;
  /** Number of leave days to convert to pay. */
  total_days: number;
  /** Monetary amount to pay for the encashed days. */
  amount: number;
}
