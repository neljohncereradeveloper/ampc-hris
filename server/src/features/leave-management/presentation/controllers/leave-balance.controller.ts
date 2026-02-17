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
import { LeaveBalance } from '../../domain/models';
import {
    RATE_LIMIT_MODERATE,
    RateLimit,
} from '@/core/infrastructure/decorators';
import {
    CloseBalanceUseCase,
    CloseBalancesForEmployeeUseCase,
    GenerateBalancesForAllEmployeesUseCase,
    ResetBalancesForYearUseCase,
    GetLeaveBalanceByIdUseCase,
    GetLeaveBalanceByLeaveTypeUseCase,
    GetLeaveBalanceByEmployeeYearUseCase,
    CreateLeaveBalanceUseCase,
    GenerateBalancesForAllEmployeesResult,
} from '../../application/use-cases/leave-balance';
import { CreateLeaveBalanceDto } from '../dto/leave-balance/create-leave-balance.dto';
import { GenerateForYearDto } from '../dto/leave-balance/generate-for-year.dto';
import { CreateLeaveBalanceCommand } from '../../application/commands/leave-balance/create.command';
import { ActiveEmployeeIdsFilters } from '../../domain';

@ApiTags('Leave Balance')
@Controller('leave-balances')
@RateLimit({
    ...RATE_LIMIT_MODERATE,
    message: 'Too many requests. Please try again later.',
})
export class LeaveBalanceController {
    constructor(
        private readonly createLeaveBalanceUseCase: CreateLeaveBalanceUseCase,
        private readonly closeBalanceUseCase: CloseBalanceUseCase,
        private readonly closeBalancesForEmployeeUseCase: CloseBalancesForEmployeeUseCase,
        private readonly generateBalancesForAllEmployeesUseCase: GenerateBalancesForAllEmployeesUseCase,
        private readonly resetBalancesForYearUseCase: ResetBalancesForYearUseCase,
        private readonly getLeaveBalanceByIdUseCase: GetLeaveBalanceByIdUseCase,
        private readonly getLeaveBalanceByLeaveTypeUseCase: GetLeaveBalanceByLeaveTypeUseCase,
        private readonly getLeaveBalanceByEmployeeYearUseCase: GetLeaveBalanceByEmployeeYearUseCase,
    ) { }

    @Version('1')
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
    @RequirePermissions(PERMISSIONS.LEAVE_BALANCES.CREATE)
    @ApiOperation({ summary: 'Create a new leave balance' })
    @ApiBody({ type: CreateLeaveBalanceDto })
    @ApiResponse({ status: 201, description: 'Leave balance created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async create(
        @Body() presentationDto: CreateLeaveBalanceDto,
        @Req() request: Request,
    ): Promise<LeaveBalance> {
        const requestInfo = createRequestInfo(request);
        const command: CreateLeaveBalanceCommand = {
            employee_id: presentationDto.employee_id,
            policy_id: presentationDto.policy_id,
            year: presentationDto.year,
            remarks: presentationDto.remarks,
        };
        return this.createLeaveBalanceUseCase.execute(command, requestInfo);
    }

    @Version('1')
    @Patch(':id/close')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN)
    @RequirePermissions(PERMISSIONS.LEAVE_BALANCES.CLOSE)
    @ApiOperation({ summary: 'Close a leave balance' })
    @ApiParam({ name: 'id', description: 'Leave balance ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Leave balance closed successfully' })
    @ApiResponse({ status: 404, description: 'Leave balance not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async close(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request,
    ): Promise<{ success: boolean }> {
        const requestInfo = createRequestInfo(request);
        await this.closeBalanceUseCase.execute(id, requestInfo);
        return { success: true };
    }

    @Version('1')
    @Patch(':employee_id/close-for-year')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN)
    @RequirePermissions(PERMISSIONS.LEAVE_BALANCES.CLOSE_BALANCES_FOR_EMPLOYEE)
    @ApiOperation({ summary: 'Close all leave balances for an employee for a given year' })
    @ApiParam({ name: 'employee_id', description: 'Employee ID', example: 1 })
    @ApiParam({ name: 'year', description: 'Year', example: '2025' })
    @ApiResponse({ status: 200, description: 'Leave balances closed successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async closeBalancesForEmployee(
        @Param('employee_id', ParseIntPipe) employee_id: number,
        @Query('year') year: string,
        @Req() request: Request,
    ): Promise<{ success: boolean }> {
        const requestInfo = createRequestInfo(request);
        await this.closeBalancesForEmployeeUseCase.execute(employee_id, year, requestInfo);
        return { success: true };
    }

    @Version('1')
    @Patch(':year/reset')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN)
    @RequirePermissions(PERMISSIONS.LEAVE_BALANCES.RESET_FOR_YEAR)
    @ApiOperation({ summary: 'Reset balances for a year' })
    @ApiParam({ name: 'year', description: 'Year', example: '2025' })
    @ApiResponse({ status: 200, description: 'Balances reset successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async resetBalancesForYear(
        @Param('year') year: string,
        @Req() request: Request,
    ): Promise<{ success: boolean }> {
        const requestInfo = createRequestInfo(request);
        await this.resetBalancesForYearUseCase.execute(year, requestInfo);
        return { success: true };
    }

    @Version('1')
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
    @RequirePermissions(PERMISSIONS.LEAVE_BALANCES.READ)
    @ApiOperation({ summary: 'Get leave balance by ID' })
    @ApiParam({ name: 'id', description: 'Leave balance ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Leave balance retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Leave balance not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async getLeaveBalanceById(@Param('id', ParseIntPipe) id: number): Promise<LeaveBalance | null> {
        return this.getLeaveBalanceByIdUseCase.execute(id);
    }

    @Version('1')
    @Get(':employee_id/year/:year')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
    @RequirePermissions(PERMISSIONS.LEAVE_BALANCES.READ)
    @ApiOperation({ summary: 'Get leave balance by employee and year' })
    @ApiParam({ name: 'employee_id', description: 'Employee ID', example: 1 })
    @ApiParam({ name: 'year', description: 'Year', example: '2025' })
    @ApiResponse({ status: 200, description: 'Leave balance retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Leave balance not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async getLeaveBalanceByEmployeeYear(
        @Param('employee_id', ParseIntPipe) employee_id: number,
        @Param('year') year: string,
    ): Promise<LeaveBalance[] | null> {
        return this.getLeaveBalanceByEmployeeYearUseCase.execute(employee_id, year);
    }

    @Version('1')
    @Get(':employee_id/leave-type/:leave_type_id/year/:year')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
    @RequirePermissions(PERMISSIONS.LEAVE_BALANCES.READ)
    @ApiOperation({ summary: 'Get leave balance by leave type' })
    @ApiParam({ name: 'leave_type_id', description: 'Leave type ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Leave balance retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Leave balance not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async getLeaveBalanceByLeaveType(
        @Param('leave_type_code') leave_type_code: string,
        @Param('employee_id', ParseIntPipe) employee_id: number,
        @Param('year') year: string,
    ): Promise<LeaveBalance | null> {
        return this.getLeaveBalanceByLeaveTypeUseCase.execute(employee_id, leave_type_code, year);
    }

    @Version('1')
    @Post('generate-for-all-employees')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN)
    @RequirePermissions(PERMISSIONS.LEAVE_BALANCES.GENERATE_BALANCES_FOR_ALL_EMPLOYEES)
    @ApiOperation({ summary: 'Generate balances for all employees' })
    @ApiResponse({ status: 200, description: 'Balances generated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async generateBalancesForAllEmployees(
        @Body() presentationDto: GenerateForYearDto,
        @Req() request: Request,
    ): Promise<GenerateBalancesForAllEmployeesResult> {
        const requestInfo = createRequestInfo(request);
        const filters: ActiveEmployeeIdsFilters = {
            employment_types: presentationDto.employment_types,
            employment_statuses: presentationDto.employment_statuses,
        };
        const result = await this.generateBalancesForAllEmployeesUseCase.execute(presentationDto.year, filters, requestInfo);
        return result;
    }

}
