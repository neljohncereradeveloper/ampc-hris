import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Version,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';
import { createRequestInfo } from '@/core/utils/request-info.util';
import {
  RequirePermissions,
  RequireRoles,
} from '@/features/auth/infrastructure/decorators';
import { PERMISSIONS, ROLES } from '@/core/domain/constants';
import {
  CreateEmployeeUseCase,
  UpdateEmployeeUseCase,
  ArchiveEmployeeUseCase,
  RestoreEmployeeUseCase,
  GetPaginatedEmployeeUseCase,
  UpdateImagePathEmployeeUseCase,
  UpdateGovernmentDetailsEmployeeUseCase,
  UpdateSalaryDetailsEmployeeUseCase,
  UpdateBankDetailsEmployeeUseCase,
  FindByIdNumberEmployeeUseCase,
  FindByBioNumberEmployeeUseCase,
  RetrieveActiveEmployeesUseCase,
  FindEmployeesEligibleForLeaveUseCase,
} from '../../application/use-cases/employee';
import {
  CreateEmployeeDto as CreateEmployeePresentationDto,
  UpdateEmployeeDto as UpdateEmployeePresentationDto,
  UpdateBankDetailsDto,
  UpdateSalaryDetailsDto,
  UpdateGovernmentDetailsDto,
  UpdateImagePathDto,
} from '../dto/employee';
import {
  CreateEmployeeCommand,
  UpdateEmployeeCommand,
  UpdateBankDetailsCommand,
  UpdateSalaryDetailsCommand,
  UpdateGovernmentDetailsCommand,
} from '../../application/commands/employee';
import { Employee } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import { RATE_LIMIT_MODERATE, RateLimit } from '@/core/infrastructure/decorators';

@ApiTags('Employee')
@Controller('employees')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly updateEmployeeUseCase: UpdateEmployeeUseCase,
    private readonly archiveEmployeeUseCase: ArchiveEmployeeUseCase,
    private readonly restoreEmployeeUseCase: RestoreEmployeeUseCase,
    private readonly getPaginatedEmployeeUseCase: GetPaginatedEmployeeUseCase,
    private readonly updateImagePathEmployeeUseCase: UpdateImagePathEmployeeUseCase,
    private readonly updateGovernmentDetailsEmployeeUseCase: UpdateGovernmentDetailsEmployeeUseCase,
    private readonly updateSalaryDetailsEmployeeUseCase: UpdateSalaryDetailsEmployeeUseCase,
    private readonly updateBankDetailsEmployeeUseCase: UpdateBankDetailsEmployeeUseCase,
    private readonly findByIdNumberEmployeeUseCase: FindByIdNumberEmployeeUseCase,
    private readonly findByBioNumberEmployeeUseCase: FindByBioNumberEmployeeUseCase,
    private readonly retrieveActiveEmployeesUseCase: RetrieveActiveEmployeesUseCase,
    private readonly findEmployeesEligibleForLeaveUseCase: FindEmployeesEligibleForLeaveUseCase,
  ) { }

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.CREATE)
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiBody({ type: CreateEmployeePresentationDto })
  @ApiResponse({ status: 201, description: 'Employee created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateEmployeePresentationDto,
    @Req() request: Request,
  ): Promise<Employee> {
    const requestInfo = createRequestInfo(request);
    const command: CreateEmployeeCommand = {
      job_title: presentationDto.job_title,
      employment_type: presentationDto.employment_type,
      employment_status: presentationDto.employment_status,
      leave_type: presentationDto.leave_type,
      branch: presentationDto.branch,
      department: presentationDto.department,
      hire_date: presentationDto.hire_date,
      id_number: presentationDto.id_number,
      bio_number: presentationDto.bio_number,
      image_path: presentationDto.image_path,
      first_name: presentationDto.first_name,
      middle_name: presentationDto.middle_name,
      last_name: presentationDto.last_name,
      suffix: presentationDto.suffix,
      birth_date: presentationDto.birth_date,
      religion: presentationDto.religion,
      civil_status: presentationDto.civil_status,
      age: presentationDto.age,
      gender: presentationDto.gender,
      citizenship: presentationDto.citizenship,
      height: presentationDto.height,
      weight: presentationDto.weight,
      home_address_street: presentationDto.home_address_street,
      home_address_barangay: presentationDto.home_address_barangay,
      home_address_city: presentationDto.home_address_city,
      home_address_province: presentationDto.home_address_province,
      home_address_zip_code: presentationDto.home_address_zip_code,
      present_address_street: presentationDto.present_address_street,
      present_address_barangay: presentationDto.present_address_barangay,
      present_address_city: presentationDto.present_address_city,
      present_address_province: presentationDto.present_address_province,
      present_address_zip_code: presentationDto.present_address_zip_code,
      cellphone_number: presentationDto.cellphone_number,
      telephone_number: presentationDto.telephone_number,
      email: presentationDto.email,
      emergency_contact_name: presentationDto.emergency_contact_name,
      emergency_contact_number: presentationDto.emergency_contact_number,
      emergency_contact_relationship: presentationDto.emergency_contact_relationship,
      emergency_contact_address: presentationDto.emergency_contact_address,
      husband_or_wife_name: presentationDto.husband_or_wife_name,
      husband_or_wife_birth_date: presentationDto.husband_or_wife_birth_date,
      husband_or_wife_occupation: presentationDto.husband_or_wife_occupation,
      number_of_children: presentationDto.number_of_children,
      fathers_name: presentationDto.fathers_name,
      fathers_birth_date: presentationDto.fathers_birth_date,
      fathers_occupation: presentationDto.fathers_occupation,
      mothers_name: presentationDto.mothers_name,
      mothers_birth_date: presentationDto.mothers_birth_date,
      mothers_occupation: presentationDto.mothers_occupation,
      remarks: presentationDto.remarks,
      is_active: presentationDto.is_active,
      labor_classification: presentationDto.labor_classification,
      labor_classification_status: presentationDto.labor_classification_status,
    };
    return this.createEmployeeUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.UPDATE)
  @ApiOperation({ summary: 'Update employee information' })
  @ApiParam({ name: 'id', description: 'Employee ID', example: 1 })
  @ApiBody({ type: UpdateEmployeePresentationDto })
  @ApiResponse({ status: 200, description: 'Employee updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateEmployeePresentationDto,
    @Req() request: Request,
  ): Promise<Employee | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateEmployeeCommand = {
      job_title: presentationDto.job_title,
      employment_type: presentationDto.employment_type,
      employment_status: presentationDto.employment_status,
      leave_type: presentationDto.leave_type,
      branch: presentationDto.branch,
      department: presentationDto.department,
      hire_date: presentationDto.hire_date,
      end_date: presentationDto.end_date,
      regularization_date: presentationDto.regularization_date,
      id_number: presentationDto.id_number,
      bio_number: presentationDto.bio_number,
      image_path: presentationDto.image_path,
      first_name: presentationDto.first_name,
      middle_name: presentationDto.middle_name,
      last_name: presentationDto.last_name,
      suffix: presentationDto.suffix,
      birth_date: presentationDto.birth_date,
      religion: presentationDto.religion,
      civil_status: presentationDto.civil_status,
      age: presentationDto.age,
      gender: presentationDto.gender,
      citizenship: presentationDto.citizenship,
      height: presentationDto.height,
      weight: presentationDto.weight,
      home_address_street: presentationDto.home_address_street,
      home_address_barangay: presentationDto.home_address_barangay,
      home_address_city: presentationDto.home_address_city,
      home_address_province: presentationDto.home_address_province,
      home_address_zip_code: presentationDto.home_address_zip_code,
      present_address_street: presentationDto.present_address_street,
      present_address_barangay: presentationDto.present_address_barangay,
      present_address_city: presentationDto.present_address_city,
      present_address_province: presentationDto.present_address_province,
      present_address_zip_code: presentationDto.present_address_zip_code,
      cellphone_number: presentationDto.cellphone_number,
      telephone_number: presentationDto.telephone_number,
      email: presentationDto.email,
      emergency_contact_name: presentationDto.emergency_contact_name,
      emergency_contact_number: presentationDto.emergency_contact_number,
      emergency_contact_relationship: presentationDto.emergency_contact_relationship,
      emergency_contact_address: presentationDto.emergency_contact_address,
      husband_or_wife_name: presentationDto.husband_or_wife_name,
      husband_or_wife_birth_date: presentationDto.husband_or_wife_birth_date,
      husband_or_wife_occupation: presentationDto.husband_or_wife_occupation,
      number_of_children: presentationDto.number_of_children,
      fathers_name: presentationDto.fathers_name,
      fathers_birth_date: presentationDto.fathers_birth_date,
      fathers_occupation: presentationDto.fathers_occupation,
      mothers_name: presentationDto.mothers_name,
      mothers_birth_date: presentationDto.mothers_birth_date,
      mothers_occupation: presentationDto.mothers_occupation,
      remarks: presentationDto.remarks,
      is_active: presentationDto.is_active,
      labor_classification: presentationDto.labor_classification,
      labor_classification_status: presentationDto.labor_classification_status,
    };
    return this.updateEmployeeUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.ARCHIVE)
  @ApiOperation({ summary: 'Archive an employee' })
  @ApiParam({ name: 'id', description: 'Employee ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Employee archived successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveEmployeeUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.RESTORE)
  @ApiOperation({ summary: 'Restore an employee' })
  @ApiParam({ name: 'id', description: 'Employee ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Employee restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreEmployeeUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.READ)
  @ApiOperation({ summary: 'Get paginated list of employees' })
  @ApiResponse({
    status: 200,
    description: 'Employees retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<Employee>> {
    return this.getPaginatedEmployeeUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Patch(':id/image-path')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.UPDATE)
  @ApiOperation({ summary: 'Update employee image path' })
  @ApiParam({ name: 'id', description: 'Employee ID', example: 1 })
  @ApiBody({ type: UpdateImagePathDto })
  @ApiResponse({ status: 200, description: 'Employee image path updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async updateImagePath(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateImagePathDto,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.updateImagePathEmployeeUseCase.execute(
      id,
      dto.image_path,
      requestInfo,
    );
    return { success: true };
  }

  @Version('1')
  @Patch(':id/government-details')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.UPDATE)
  @ApiOperation({ summary: 'Update employee government details' })
  @ApiParam({ name: 'id', description: 'Employee ID', example: 1 })
  @ApiBody({ type: UpdateGovernmentDetailsDto })
  @ApiResponse({ status: 200, description: 'Employee government details updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async updateGovernmentDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGovernmentDetailsDto,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateGovernmentDetailsCommand = {
      phic: dto.phic,
      hdmf: dto.hdmf,
      sss_no: dto.sss_no,
      tin_no: dto.tin_no,
      tax_exempt_code: dto.tax_exempt_code,
    };
    await this.updateGovernmentDetailsEmployeeUseCase.execute(
      id,
      command,
      requestInfo,
    );
    return { success: true };
  }

  @Version('1')
  @Patch(':id/salary-details')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.UPDATE)
  @ApiOperation({ summary: 'Update employee salary details' })
  @ApiParam({ name: 'id', description: 'Employee ID', example: 1 })
  @ApiBody({ type: UpdateSalaryDetailsDto })
  @ApiResponse({ status: 200, description: 'Employee salary details updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async updateSalaryDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSalaryDetailsDto,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateSalaryDetailsCommand = {
      annual_salary: dto.annual_salary,
      monthly_salary: dto.monthly_salary,
      daily_rate: dto.daily_rate,
      hourly_rate: dto.hourly_rate,
      pay_type: dto.pay_type,
    };
    await this.updateSalaryDetailsEmployeeUseCase.execute(
      id,
      command,
      requestInfo,
    );
    return { success: true };
  }

  @Version('1')
  @Patch(':id/bank-details')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.UPDATE)
  @ApiOperation({ summary: 'Update employee bank details' })
  @ApiParam({ name: 'id', description: 'Employee ID', example: 1 })
  @ApiBody({ type: UpdateBankDetailsDto })
  @ApiResponse({ status: 200, description: 'Employee bank details updated successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async updateBankDetails(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBankDetailsDto,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateBankDetailsCommand = {
      bank_account_number: dto.bank_account_number,
      bank_account_name: dto.bank_account_name,
      bank_name: dto.bank_name,
      bank_branch: dto.bank_branch,
    };
    await this.updateBankDetailsEmployeeUseCase.execute(
      id,
      command,
      requestInfo,
    );
    return { success: true };
  }

  @Version('1')
  @Get('by-id-number/:id_number')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.READ)
  @ApiOperation({ summary: 'Find employee by ID number' })
  @ApiParam({ name: 'id_number', description: 'Employee ID number', example: 'EMP001' })
  @ApiResponse({ status: 200, description: 'Employee found successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async findByIdNumber(@Param('id_number') id_number: string): Promise<Employee> {
    return this.findByIdNumberEmployeeUseCase.execute(id_number);
  }

  @Version('1')
  @Get('by-bio-number/:bio_number')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.READ)
  @ApiOperation({ summary: 'Find employee by bio number' })
  @ApiParam({ name: 'bio_number', description: 'Employee bio number', example: 'BIO001' })
  @ApiResponse({ status: 200, description: 'Employee found successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async findByBioNumber(@Param('bio_number') bio_number: string): Promise<Employee> {
    return this.findByBioNumberEmployeeUseCase.execute(bio_number);
  }

  @Version('1')
  @Get('active')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.READ)
  @ApiOperation({ summary: 'Retrieve active employees' })
  @ApiResponse({ status: 200, description: 'Active employees retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getActiveEmployees(): Promise<Employee[]> {
    return this.retrieveActiveEmployeesUseCase.execute();
  }

  @Version('1')
  @Get('eligible-for-leave')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EMPLOYEES.READ)
  @ApiOperation({ summary: 'Find employees eligible for leave' })
  @ApiResponse({ status: 200, description: 'Employees eligible for leave retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getEmployeesEligibleForLeave(
    @Query('employment_type_names') employment_type_names: string,
    @Query('employment_status_names') employment_status_names: string,
  ): Promise<Employee[]> {
    const employmentTypeNames = employment_type_names
      ? employment_type_names.split(',')
      : [];
    const employmentStatusNames = employment_status_names
      ? employment_status_names.split(',')
      : [];
    return this.findEmployeesEligibleForLeaveUseCase.execute(
      employmentTypeNames,
      employmentStatusNames,
    );
  }
}
