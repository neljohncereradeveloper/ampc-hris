import { PaginatedResult } from '@/core/utils/pagination.util';
import { TestOne } from '../models/test-one.model';

export interface TestOneRepository<Context = unknown> {
  /** Create a testOne. */
  create(test_one: TestOne, context: Context): Promise<TestOne>;
  /** Update a testOne. */
  update(id: number, dto: Partial<TestOne>, context: Context): Promise<boolean>;
  /** Find a testOne by ID. */
  findById(id: number, context: Context): Promise<TestOne | null>;
  /** Find a testOne by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<TestOne | null>;
  /** Find paginated list of testOne. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<TestOne>>;
  /** Get testOne for combobox/dropdown. */
  combobox(context: Context): Promise<TestOne[]>;
}
