import { PaginatedResult } from '@/core/utils/pagination.util';
import { TestThree } from '../models/test-three.model';

export interface TestThreeRepository<Context = unknown> {
  /** Create a testThree. */
  create(test_three: TestThree, context: Context): Promise<TestThree>;
  /** Update a testThree. */
  update(
    id: number,
    dto: Partial<TestThree>,
    context: Context,
  ): Promise<boolean>;
  /** Find a testThree by ID. */
  findById(id: number, context: Context): Promise<TestThree | null>;
  /** Find a testThree by description. */
  findByDescription(
    description: string,
    context: Context,
  ): Promise<TestThree | null>;
  /** Find paginated list of testThree. */
  findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    context: Context,
  ): Promise<PaginatedResult<TestThree>>;
  /** Get testThree for combobox/dropdown. */
  combobox(context: Context): Promise<TestThree[]>;
}
