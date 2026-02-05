import { Module } from '@nestjs/common';
import { PostgresqlDatabaseModule } from '@/core/infrastructure/database/postgresql-database.module';
import { MANAGEMENT_201_TOKENS } from './domain/constants';
import { BarangayRepositoryImpl } from './infrastructure/database/repositories/barangay.repository.impl';
import { CityRepositoryImpl } from './infrastructure/database/repositories/city.repository.impl';
import { CitizenshipRepositoryImpl } from './infrastructure/database/repositories/citizenship.repository.impl';
import { CivilStatusRepositoryImpl } from './infrastructure/database/repositories/civil-status.repository.impl';
import { EmploymentTypeRepositoryImpl } from './infrastructure/database/repositories/employment-type.repository.impl';
import { EmploymentStatusRepositoryImpl } from './infrastructure/database/repositories/employment-status.repository.impl';
import { ProvinceRepositoryImpl } from './infrastructure/database/repositories/province.repository.impl';
import { ReligionRepositoryImpl } from './infrastructure/database/repositories/religion.repository.impl';
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
  GetPaginatedCityUseCase,
  ComboboxCityUseCase,
} from './application/use-cases/city';
import {
  CreateCitizenshipUseCase,
  UpdateCitizenshipUseCase,
  ArchiveCitizenshipUseCase,
  RestoreCitizenshipUseCase,
  GetPaginatedCitizenshipUseCase,
  ComboboxCitizenshipUseCase,
} from './application/use-cases/citizenship';
import {
  CreateCivilStatusUseCase,
  UpdateCivilStatusUseCase,
  ArchiveCivilStatusUseCase,
  RestoreCivilStatusUseCase,
  GetPaginatedCivilStatusUseCase,
  ComboboxCivilStatusUseCase,
} from './application/use-cases/civil-status';
import {
  CreateEmploymentTypeUseCase,
  UpdateEmploymentTypeUseCase,
  ArchiveEmploymentTypeUseCase,
  RestoreEmploymentTypeUseCase,
  GetPaginatedEmploymentTypeUseCase,
  ComboboxEmploymentTypeUseCase,
} from './application/use-cases/employment-type';
import {
  CreateEmploymentStatusUseCase,
  UpdateEmploymentStatusUseCase,
  ArchiveEmploymentStatusUseCase,
  RestoreEmploymentStatusUseCase,
  GetPaginatedEmploymentStatusUseCase,
  ComboboxEmploymentStatusUseCase,
} from './application/use-cases/employment-status';
import {
  CreateProvinceUseCase,
  UpdateProvinceUseCase,
  ArchiveProvinceUseCase,
  RestoreProvinceUseCase,
  GetPaginatedProvinceUseCase,
  ComboboxProvinceUseCase,
} from './application/use-cases/province';
import {
  CreateReligionUseCase,
  UpdateReligionUseCase,
  ArchiveReligionUseCase,
  RestoreReligionUseCase,
  GetPaginatedReligionUseCase,
  ComboboxReligionUseCase,
} from './application/use-cases/religion';
import {
  BarangayController,
  CityController,
  CitizenshipController,
  CivilStatusController,
  EmploymentTypeController,
  EmploymentStatusController,
  ProvinceController,
  ReligionController,
} from './presentation/controllers';
import { TransactionAdapter } from '@/core/infrastructure/database/adapters/transaction-helper.adapter';
import { TOKENS_CORE } from '@/core/domain/constants';
import { ActivityLogRepositoryImpl } from '@/core/infrastructure/database/repositories';

@Module({
  imports: [PostgresqlDatabaseModule],
  controllers: [
    BarangayController,
    CityController,
    CitizenshipController,
    CivilStatusController,
    EmploymentTypeController,
    EmploymentStatusController,
    ProvinceController,
    ReligionController,
  ],
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
      provide: MANAGEMENT_201_TOKENS.CITIZENSHIP,
      useClass: CitizenshipRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.CIVIL_STATUS,
      useClass: CivilStatusRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.EMPLOYMENT_TYPE,
      useClass: EmploymentTypeRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.EMPLOYMENT_STATUS,
      useClass: EmploymentStatusRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.PROVINCE,
      useClass: ProvinceRepositoryImpl,
    },
    {
      provide: MANAGEMENT_201_TOKENS.RELIGION,
      useClass: ReligionRepositoryImpl,
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
    GetPaginatedCityUseCase,
    ComboboxCityUseCase,
    // Citizenship use cases
    CreateCitizenshipUseCase,
    UpdateCitizenshipUseCase,
    ArchiveCitizenshipUseCase,
    RestoreCitizenshipUseCase,
    GetPaginatedCitizenshipUseCase,
    ComboboxCitizenshipUseCase,
    // Civil status use cases (no get-by-id)
    CreateCivilStatusUseCase,
    UpdateCivilStatusUseCase,
    ArchiveCivilStatusUseCase,
    RestoreCivilStatusUseCase,
    GetPaginatedCivilStatusUseCase,
    ComboboxCivilStatusUseCase,
    // Employment type use cases (no get-by-id)
    CreateEmploymentTypeUseCase,
    UpdateEmploymentTypeUseCase,
    ArchiveEmploymentTypeUseCase,
    RestoreEmploymentTypeUseCase,
    GetPaginatedEmploymentTypeUseCase,
    ComboboxEmploymentTypeUseCase,
    // Employment status use cases (no get-by-id)
    CreateEmploymentStatusUseCase,
    UpdateEmploymentStatusUseCase,
    ArchiveEmploymentStatusUseCase,
    RestoreEmploymentStatusUseCase,
    GetPaginatedEmploymentStatusUseCase,
    ComboboxEmploymentStatusUseCase,
    // Province use cases (no get-by-id)
    CreateProvinceUseCase,
    UpdateProvinceUseCase,
    ArchiveProvinceUseCase,
    RestoreProvinceUseCase,
    GetPaginatedProvinceUseCase,
    ComboboxProvinceUseCase,
    // Religion use cases (no get-by-id)
    CreateReligionUseCase,
    UpdateReligionUseCase,
    ArchiveReligionUseCase,
    RestoreReligionUseCase,
    GetPaginatedReligionUseCase,
    ComboboxReligionUseCase,
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
    GetPaginatedCityUseCase,
    ComboboxCityUseCase,
    // Citizenship use cases
    CreateCitizenshipUseCase,
    UpdateCitizenshipUseCase,
    ArchiveCitizenshipUseCase,
    RestoreCitizenshipUseCase,
    GetPaginatedCitizenshipUseCase,
    ComboboxCitizenshipUseCase,
    // Civil status use cases (no get-by-id)
    CreateCivilStatusUseCase,
    UpdateCivilStatusUseCase,
    ArchiveCivilStatusUseCase,
    RestoreCivilStatusUseCase,
    GetPaginatedCivilStatusUseCase,
    ComboboxCivilStatusUseCase,
    // Employment type use cases (no get-by-id)
    CreateEmploymentTypeUseCase,
    UpdateEmploymentTypeUseCase,
    ArchiveEmploymentTypeUseCase,
    RestoreEmploymentTypeUseCase,
    GetPaginatedEmploymentTypeUseCase,
    ComboboxEmploymentTypeUseCase,
    // Employment status use cases (no get-by-id)
    CreateEmploymentStatusUseCase,
    UpdateEmploymentStatusUseCase,
    ArchiveEmploymentStatusUseCase,
    RestoreEmploymentStatusUseCase,
    GetPaginatedEmploymentStatusUseCase,
    ComboboxEmploymentStatusUseCase,
    // Province use cases (no get-by-id)
    CreateProvinceUseCase,
    UpdateProvinceUseCase,
    ArchiveProvinceUseCase,
    RestoreProvinceUseCase,
    GetPaginatedProvinceUseCase,
    ComboboxProvinceUseCase,
    // Religion use cases (no get-by-id)
    CreateReligionUseCase,
    UpdateReligionUseCase,
    ArchiveReligionUseCase,
    RestoreReligionUseCase,
    GetPaginatedReligionUseCase,
    ComboboxReligionUseCase,
  ],
})
export class Management201Module { }
