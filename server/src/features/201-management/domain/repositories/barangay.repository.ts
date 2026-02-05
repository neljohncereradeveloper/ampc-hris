import { PaginatedResult } from '@/core/utils/pagination.util';
import { Barangay } from '../models/barangay.model';

export interface BarangayRepository<Context = unknown> {
  /** Create a barangay. */
  create(barangay: Barangay, context: Context): Promise<Barangay>;
  /** Update a barangay. */
  update(id: number, dto: Partial<Barangay>, context: Context): Promise<boolean>;
  /** Find a barangay by ID. */
  findById(id: number, context: Context): Promise<Barangay | null>;
  /** Find a barangay by description. */
  findByDescription(description: string, context: Context): Promise<Barangay | null>;
  /** Find paginated list of barangays. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<Barangay>>;
  /** Get barangays for combobox/dropdown. */
  combobox(context: Context): Promise<Barangay[]>;
}
