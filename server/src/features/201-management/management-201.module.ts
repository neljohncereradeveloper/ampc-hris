import { Module } from '@nestjs/common';
import { PostgresqlDatabaseModule } from '@/core/infrastructure/database/postgresql-database.module';
import { MANAGEMENT_201_TOKENS } from './domain/constants';
import { BarangayRepositoryImpl } from './infrastructure/database/repositories/barangay.repository.impl';
import { CityRepositoryImpl } from './infrastructure/database/repositories/city.repository.impl';
import {
  CreateBarangayUseCase,
  UpdateBarangayUseCase,
  ArchiveBarangayUseCase,
  RestoreBarangayUseCase,
  GetPaginatedBarangayUseCase,
  ComboboxBarangayUseCase,
} from './application/use-cases/barangay';
import {
  CreateCityUseCase,
  UpdateCityUseCase,
  ArchiveCityUseCase,
  RestoreCityUseCase,
  GetCityByIdUseCase,
  GetPaginatedCityUseCase,
  ComboboxCityUseCase,
} from './application/use-cases/city';
import { BarangayController, CityController } from './presentation/controllers';
import { TransactionAdapter } from '@/core/infrastructure/database/adapters/transaction-helper.adapter';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepositoryImpl } from '@/core/infrastructure/database/repositories';

@Module({
  imports: [PostgresqlDatabaseModule],
  controllers: [BarangayController, CityController],
  providers: [
    // Repository implementation
    {
      provide: MANAGEMENT_201_TOKENS.BARANGAY,
      useClass: BarangayRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.CITY,
      useClass: CityRepositoryImpl,
    },
    {
      provide: TOKENS_CORE.TRANSACTIONPORT,
      useClass: TransactionAdapter,
    },
    {
      provide: TOKENS_CORE.ACTIVITYLOGS,
      useClass: ActivityLogRepositoryImpl,
    },
    // Use cases
    // Barangay use cases
    CreateBarangayUseCase,
    UpdateBarangayUseCase,
    ArchiveBarangayUseCase,
    RestoreBarangayUseCase,
    GetPaginatedBarangayUseCase,
    ComboboxBarangayUseCase,
    // City use cases
    CreateCityUseCase,
    UpdateCityUseCase,
    ArchiveCityUseCase,
    RestoreCityUseCase,
    GetCityByIdUseCase,
    GetPaginatedCityUseCase,
    ComboboxCityUseCase,
  ],
  exports: [
    // Barangay use cases
    CreateBarangayUseCase,
    UpdateBarangayUseCase,
    ArchiveBarangayUseCase,
    RestoreBarangayUseCase,
    GetPaginatedBarangayUseCase,
    ComboboxBarangayUseCase,
    // City use cases
    CreateCityUseCase,
    UpdateCityUseCase,
    ArchiveCityUseCase,
    RestoreCityUseCase,
    GetCityByIdUseCase,
    GetPaginatedCityUseCase,
    ComboboxCityUseCase,
  ],
})
export class Management201Module { }
