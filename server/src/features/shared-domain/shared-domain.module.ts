import { Module } from '@nestjs/common';
import { PostgresqlDatabaseModule } from '@/core/infrastructure/database/postgresql-database.module';
import { SHARED_DOMAIN_TOKENS } from './domain/constants';
import { BranchRepositoryImpl } from './infrastructure/database/repositories/branch.repository.impl';
import {
  CreateBranchUseCase,
  UpdateBranchUseCase,
  ArchiveBranchUseCase,
  RestoreBranchUseCase,
  GetPaginatedBranchUseCase,
  ComboboxBranchUseCase,
} from './application/use-cases/branch';
import { BranchController } from './presentation/controllers/branch.controller';
import { TransactionAdapter } from '@/core/infrastructure/database/adapters/transaction-helper.adapter';
import { ActivityLogRepositoryImpl } from '@/core/infrastructure/database/repositories';
import { TOKENS_CORE } from '@/core/domain/constants';

@Module({
  imports: [PostgresqlDatabaseModule],
  controllers: [BranchController],
  providers: [
    // Repository implementation
    {
      provide: SHARED_DOMAIN_TOKENS.BRANCH,
      useClass: BranchRepositoryImpl,
    },
    {
      provide: TOKENS_CORE.TRANSACTIONPORT,
      useClass: TransactionAdapter,
    },
    {
      provide: TOKENS_CORE.ACTIVITYLOGS,
      useClass: ActivityLogRepositoryImpl,
    },
    // Use cases (no get-by-id)
    CreateBranchUseCase,
    UpdateBranchUseCase,
    ArchiveBranchUseCase,
    RestoreBranchUseCase,
    GetPaginatedBranchUseCase,
    ComboboxBranchUseCase,
  ],
  exports: [
    // Branch use cases (no get-by-id)
    CreateBranchUseCase,
    UpdateBranchUseCase,
    ArchiveBranchUseCase,
    RestoreBranchUseCase,
    GetPaginatedBranchUseCase,
    ComboboxBranchUseCase,
    // Export repository token for use in other modules
    SHARED_DOMAIN_TOKENS.BRANCH,
  ],
})
export class SharedDomainModule { }
