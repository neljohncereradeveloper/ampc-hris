import { Module } from '@nestjs/common';
import { PostgresqlDatabaseModule } from '@/core/infrastructure/database/postgresql-database.module';
import { TransactionAdapter } from '@/core/infrastructure/database/adapters/transaction-helper.adapter';
import { ActivityLogRepositoryImpl } from '@/core/infrastructure/database/repositories';
import { TOKENS_CORE } from '@/core/domain/constants';

import { TEST_TOKENS } from './domain/constants';
import { SharedDomainModule } from '@/features/shared-domain/shared-domain.module';

import { TestOneRepositoryImpl } from './infrastructure/database/repositories';
import { TestTwoRepositoryImpl } from './infrastructure/database/repositories';
import { TestThreeRepositoryImpl } from './infrastructure/database/repositories';
// PLOP-IMPORT-REPOSITORIES
import * as TestOneUseCases from './application/use-cases/test-one';
import * as TestTwoUseCases from './application/use-cases/test-two';
import * as TestThreeUseCases from './application/use-cases/test-three';
// PLOP-IMPORT-USECASES
import { TestOneController } from './presentation/controllers';
import { TestTwoController } from './presentation/controllers';
import { TestThreeController } from './presentation/controllers';
// PLOP-IMPORT-CONTROLLERS

/**
 * =========================
 * USE CASES
 * =========================
 */

const testOneUseCaseList = [
  TestOneUseCases.CreateTestOneUseCase,
  TestOneUseCases.UpdateTestOneUseCase,
  TestOneUseCases.ArchiveTestOneUseCase,
  TestOneUseCases.RestoreTestOneUseCase,
  TestOneUseCases.GetPaginatedTestOneUseCase,
];

const testTwoUseCaseList = [
  TestTwoUseCases.CreateTestTwoUseCase,
  TestTwoUseCases.UpdateTestTwoUseCase,
  TestTwoUseCases.ArchiveTestTwoUseCase,
  TestTwoUseCases.RestoreTestTwoUseCase,
  TestTwoUseCases.GetPaginatedTestTwoUseCase,
];

const testThreeUseCaseList = [
  TestThreeUseCases.CreateTestThreeUseCase,
  TestThreeUseCases.UpdateTestThreeUseCase,
  TestThreeUseCases.ArchiveTestThreeUseCase,
  TestThreeUseCases.RestoreTestThreeUseCase,
  TestThreeUseCases.GetPaginatedTestThreeUseCase,
];

// PLOP-DECLARE-USECASE-LISTS

@Module({
  imports: [PostgresqlDatabaseModule, SharedDomainModule],
  controllers: [
    TestOneController,
    TestTwoController,
    TestThreeController,
    // PLOP-CONTROLLERS
  ],
  providers: [
    {
      provide: TOKENS_CORE.TRANSACTIONPORT,
      useClass: TransactionAdapter,
    },
    {
      provide: TOKENS_CORE.ACTIVITYLOGS,
      useClass: ActivityLogRepositoryImpl,
    },

    {
      provide: TEST_TOKENS.TEST_ONE,
      useClass: TestOneRepositoryImpl,
    },

    {
      provide: TEST_TOKENS.TEST_TWO,
      useClass: TestTwoRepositoryImpl,
    },

    {
      provide: TEST_TOKENS.TEST_THREE,
      useClass: TestThreeRepositoryImpl,
    },
    // PLOP-PROVIDERS

    ...testOneUseCaseList,
    ...testTwoUseCaseList,
    ...testThreeUseCaseList,
    // PLOP-USECASE-SPREAD
  ],
  exports: [
    TEST_TOKENS.TEST_ONE,
    TEST_TOKENS.TEST_TWO,
    TEST_TOKENS.TEST_THREE,
    // PLOP-EXPORTS
    ...testOneUseCaseList,
    ...testTwoUseCaseList,
    ...testThreeUseCaseList,
    // PLOP-EXPORT-USECASE-SPREAD
  ],
})
export class TestModule {}
