/**
 * Command for creating a training certificate
 * Application layer command - simple type definition without validation
 */
export interface CreateTrainingCertificateCommand {
  certificate_name: string;
  issuing_organization: string;
  issue_date: Date;
  expiry_date?: Date | null;
  certificate_number?: string | null;
  file_path?: string | null;
}
