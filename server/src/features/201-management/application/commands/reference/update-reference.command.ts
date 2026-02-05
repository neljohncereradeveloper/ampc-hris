/**
 * Command for updating a reference
 * Application layer command - simple type definition without validation
 */
export interface UpdateReferenceCommand {
  fname: string;
  mname?: string;
  lname: string;
  suffix?: string;
  cellphone_number?: string;
}
