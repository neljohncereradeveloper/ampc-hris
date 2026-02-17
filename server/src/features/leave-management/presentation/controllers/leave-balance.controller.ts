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
import { LeaveBalance, LeavePolicy } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
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
} from '../../application/use-cases/leave-balance';
import { CreateLeaveBalanceDto } from '../dto/leave-balance/create-leave-balance.dto';
import { GenerateForYearDto } from '../dto/leave-balance/generate-for-year.dto';
import { CreateLeaveBalanceCommand } from '../../application/commands/leave-balance/create.command';

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



}
