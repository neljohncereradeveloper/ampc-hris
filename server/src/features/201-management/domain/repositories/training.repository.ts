import { PaginatedResult } from '@/core/utils/pagination.util';
import { Training } from '../models/training.model';

export interface TrainingRepository<Context = unknown> {
  /** Create a training. */
  create(training: Training, context: Context): Promise<Training>;
  /** Update a training. */
  update(
    id: number,
    dto: Partial<Training>,
    context: Context,
  ): Promise<boolean>;
  /** Find a training by ID. */
  findById(id: number, context: Context): Promise<Training | null>;
  /** Find trainings by employee ID. */
  findByEmployeeId(employee_id: number, context: Context): Promise<Training[]>;
  /** Find trainings by training certificate ID. */
  findByTrainingCertificateId(trainings_cert_id: number, context: Context): Promise<Training[]>;
  /** Find paginated list of trainings. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    employee_id: number,
    context: Context,
  ): Promise<PaginatedResult<Training>>;
}
