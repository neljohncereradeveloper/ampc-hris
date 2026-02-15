/**
 * Command for marking a leave encashment as paid.
 */
export interface MarkAsPaidLeaveEncashmentCommand {
  /** Payroll reference or transaction ID linking this encashment to the payment. */
  payroll_ref: string;
}
