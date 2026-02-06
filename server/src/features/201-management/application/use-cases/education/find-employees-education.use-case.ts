import { Inject, Injectable } from '@nestjs/common';
import { TOKENS_CORE } from '@/core/domain/constants';
import { TransactionPort } from '@/core/domain/ports';
import { EducationRepository } from '@/features/201-management/domain/repositories';
import { Education } from '@/features/201-management/domain/models';
import {
  EDUCATION_ACTIONS,
  MANAGEMENT_201_TOKENS,
} from '@/features/201-management/domain/constants';

@Injectable()
export class FindEmployeesEducationUseCase {
  constructor(
    @Inject(MANAGEMENT_201_TOKENS.EDUCATION)
    private readonly educationRepository: EducationRepository,
    @Inject(TOKENS_CORE.TRANSACTIONPORT)
    private readonly transactionHelper: TransactionPort,
  ) {}

  async execute(
    employee_id: number,
    is_archived: boolean,
  ): Promise<{ data: Education[] }> {
    return this.transactionHelper.executeTransaction(
      EDUCATION_ACTIONS.FIND_EMPLOYEES_EDUCATION,
      async (manager) => {
        return this.educationRepository.findEmployeesEducation(
          employee_id,
          is_archived,
          manager,
        );
      },
    );
  }
}
