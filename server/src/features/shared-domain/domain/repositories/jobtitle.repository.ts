import { PaginatedResult } from '@/core/utils/pagination.util';
import { Jobtitle } from '../models/jobtitle.model';

export interface JobtitleRepository<Context = unknown> {
  /** Create a jobtitle. */
  create(jobtitle: Jobtitle, context: Context): Promise<Jobtitle>;
  /** Update a jobtitle. */
  update(
    id: number,
    dto: Partial<Jobtitle>,
    context: Context,
  ): Promise<boolean>;
  /** Find a jobtitle by ID. */
  findById(id: number, context: Context): Promise<Jobtitle | null>;
  /** Find a jobtitle by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<Jobtitle | null>;
  /** Find paginated list of jobtitles. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<Jobtitle>>;
  /** Get jobtitles for combobox/dropdown. */
  combobox(context: Context): Promise<Jobtitle[]>;
}
