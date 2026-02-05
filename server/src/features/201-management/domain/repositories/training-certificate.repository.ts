import { PaginatedResult } from '@/core/utils/pagination.util';
import { TrainingCertificate } from '../models/training-certificate.model';

export interface TrainingCertificateRepository<Context = unknown> {
  /** Create a training certificate. */
  create(certificate: TrainingCertificate, context: Context): Promise<TrainingCertificate>;
  /** Update a training certificate. */
  update(
    id: number,
    dto: Partial<TrainingCertificate>,
    context: Context,
  ): Promise<boolean>;
  /** Find a training certificate by ID. */
  findById(id: number, context: Context): Promise<TrainingCertificate | null>;
  /** Find paginated list of training certificates. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<TrainingCertificate>>;
  /** Get training certificates for combobox/dropdown. */
  combobox(context: Context): Promise<TrainingCertificate[]>;
}
