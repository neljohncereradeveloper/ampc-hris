/**
 * Command for updating employee bank details
 * Application layer command - simple type definition without validation
 */
export interface UpdateBankDetailsCommand {
  bank_account_number?: string;
  bank_account_name?: string;
  bank_name?: string;
  bank_branch?: string;
}
