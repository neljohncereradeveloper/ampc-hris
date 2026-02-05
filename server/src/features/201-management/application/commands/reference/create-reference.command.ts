/**
 * Command for creating a reference
 * Application layer command - simple type definition without validation
 */
export interface CreateReferenceCommand {
  employee_id?: number;
  fname: string;
  mname?: string;
  lname: string;
  suffix?: string;
  cellphone_number?: string;
}
