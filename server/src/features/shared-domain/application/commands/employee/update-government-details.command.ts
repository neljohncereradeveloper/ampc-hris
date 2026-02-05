/**
 * Command for updating employee government details
 * Application layer command - simple type definition without validation
 */
export interface UpdateGovernmentDetailsCommand {
  phic?: string;
  hdmf?: string;
  sss_no?: string;
  tin_no?: string;
  tax_exempt_code?: string;
}
