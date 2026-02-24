import { PaginatedResult } from '@/core/utils/pagination.util';
import { TestTwo } from '../models/test-two.model';

export interface TestTwoRepository<Context = unknown> {
  /** Create a testTwo. */
  create(test_two: TestTwo, context: Context): Promise<TestTwo>;
  /** Update a testTwo. */
  update(id: number, dto: Partial<TestTwo>, context: Context): Promise<boolean>;
  /** Find a testTwo by ID. */
  findById(id: number, context: Context): Promise<TestTwo | null>;
  /** Find a testTwo by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<TestTwo | null>;
  /** Find paginated list of testTwo. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<TestTwo>>;
  /** Get testTwo for combobox/dropdown. */
  combobox(context: Context): Promise<TestTwo[]>;
}
