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
import { LeavePolicy } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
    RATE_LIMIT_MODERATE,
    RateLimit,
} from '@/core/infrastructure/decorators';
import {
    CreateLeavePolicyUseCase, UpdateLeavePolicyUseCase,
    ArchiveLeavePolicyUseCase,
    RestoreLeavePolicyUseCase,
    GetPaginatedLeavePolicyUseCase,
    RetrieveActivePoliciesUseCase,
    ActivatePolicyUseCase,
    RetirePolicyUseCase,
    GetActivePolicyUseCase
} from '../../application/use-cases/leave-policy';
import { CreateLeavePolicyDto } from '../dto/leave-policy/create-leave-policy.dto';
import { CreateLeavePolicyCommand } from '../../application/commands/leave-policy/create.command';
import { UpdateLeavePolicyDto } from '../dto/leave-policy/update-leave-policy.dto';
import { UpdateLeavePolicyCommand } from '../../application/commands/leave-policy';

@ApiTags('Leave Policy')
@Controller('leave-policies')
@RateLimit({
    ...RATE_LIMIT_MODERATE,
    message: 'Too many requests. Please try again later.',
})
export class LeavePolicyController {
    constructor(
        private readonly createLeavePolicyUseCase: CreateLeavePolicyUseCase,
        private readonly updateLeavePolicyUseCase: UpdateLeavePolicyUseCase,
        private readonly archiveLeavePolicyUseCase: ArchiveLeavePolicyUseCase,
        private readonly restoreLeavePolicyUseCase: RestoreLeavePolicyUseCase,
        private readonly getPaginatedLeavePolicyUseCase: GetPaginatedLeavePolicyUseCase,
        private readonly retrieveActivePoliciesUseCase: RetrieveActivePoliciesUseCase,
        private readonly getActivePolicyUseCase: GetActivePolicyUseCase,
        private readonly activatePolicyUseCase: ActivatePolicyUseCase,
        private readonly retirePolicyUseCase: RetirePolicyUseCase,
    ) { }

    @Version('1')
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
    @RequirePermissions(PERMISSIONS.LEAVE_POLICIES.CREATE)
    @ApiOperation({ summary: 'Create a new leave policy' })
    @ApiBody({ type: CreateLeavePolicyDto })
    @ApiResponse({ status: 201, description: 'Leave policy created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async create(
        @Body() presentationDto: CreateLeavePolicyDto,
        @Req() request: Request,
    ): Promise<LeavePolicy> {
        const requestInfo = createRequestInfo(request);
        const command: CreateLeavePolicyCommand = {
            leave_type: presentationDto.leave_type,
            annual_entitlement: presentationDto.annual_entitlement,
            carry_limit: presentationDto.carry_limit,
            encash_limit: presentationDto.encash_limit,
            carried_over_years: presentationDto.carried_over_years,
            effective_date: presentationDto.effective_date,
            expiry_date: presentationDto.expiry_date,
            remarks: presentationDto.remarks,
            minimum_service_months: presentationDto.minimum_service_months,
            allowed_employment_types: presentationDto.allowed_employment_types,
            allowed_employee_statuses: presentationDto.allowed_employee_statuses,
            excluded_weekdays: presentationDto.excluded_weekdays,
        };
        return this.createLeavePolicyUseCase.execute(command, requestInfo);
    }

    @Version('1')
    @Put(':id')
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
    @RequirePermissions(PERMISSIONS.LEAVE_POLICIES.UPDATE)
    @ApiOperation({ summary: 'Update leave policy information' })
    @ApiParam({ name: 'id', description: 'Leave policy ID', example: 1 })
    @ApiBody({ type: UpdateLeavePolicyDto })
    @ApiResponse({ status: 200, description: 'Leave policy updated successfully' })
    @ApiResponse({ status: 404, description: 'Leave policy not found' })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() presentationDto: UpdateLeavePolicyDto,
        @Req() request: Request,
    ): Promise<LeavePolicy | null> {
        const requestInfo = createRequestInfo(request);
        const command: UpdateLeavePolicyCommand = {
            annual_entitlement: presentationDto.annual_entitlement,
            carry_limit: presentationDto.carry_limit,
            encash_limit: presentationDto.encash_limit,
            carried_over_years: presentationDto.carried_over_years,
            effective_date: presentationDto.effective_date,
            expiry_date: presentationDto.expiry_date,
            remarks: presentationDto.remarks,
            minimum_service_months: presentationDto.minimum_service_months,
            allowed_employment_types: presentationDto.allowed_employment_types,
            allowed_employee_statuses: presentationDto.allowed_employee_statuses,
            excluded_weekdays: presentationDto.excluded_weekdays,
        };
        return this.updateLeavePolicyUseCase.execute(id, command, requestInfo);

    }

    @Version('1')
    @Delete(':id/archive')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN)
    @RequirePermissions(PERMISSIONS.LEAVE_POLICIES.ARCHIVE)
    @ApiOperation({ summary: 'Archive a leave policy' })
    @ApiParam({ name: 'id', description: 'Leave policy ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Leave policy archived successfully' })
    @ApiResponse({ status: 404, description: 'Leave policy not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async archive(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request,
    ): Promise<{ success: boolean }> {
        const requestInfo = createRequestInfo(request);
        await this.archiveLeavePolicyUseCase.execute(id, requestInfo);
        return { success: true };
    }

    @Version('1')
    @Patch(':id/restore')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN)
    @RequirePermissions(PERMISSIONS.LEAVE_POLICIES.RESTORE)
    @ApiOperation({ summary: 'Restore a leave policy' })
    @ApiParam({ name: 'id', description: 'Leave policy ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Leave policy restored successfully',
    })
    @ApiResponse({ status: 404, description: 'Leave policy not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async restore(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request,
    ): Promise<{ success: boolean }> {
        const requestInfo = createRequestInfo(request);
        await this.restoreLeavePolicyUseCase.execute(id, requestInfo);
        return { success: true };
    }

    @Version('1')
    @Patch(':id/activate')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN)
    @RequirePermissions(PERMISSIONS.LEAVE_POLICIES.ACTIVATE)
    @ApiOperation({ summary: 'Activate a leave policy' })
    @ApiParam({ name: 'id', description: 'Leave policy ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Leave policy activated successfully' })
    @ApiResponse({ status: 404, description: 'Leave policy not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async activate(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request,
    ): Promise<{ success: boolean }> {
        const requestInfo = createRequestInfo(request);
        await this.activatePolicyUseCase.execute(id, requestInfo);
        return { success: true };
    }

    @Version('1')
    @Patch(':id/retire')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN)
    @RequirePermissions(PERMISSIONS.LEAVE_POLICIES.RETIRE)
    @ApiOperation({ summary: 'Retire a leave policy' })
    @ApiParam({ name: 'id', description: 'Leave policy ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Leave policy retired successfully' })
    @ApiResponse({ status: 404, description: 'Leave policy not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async retire(
        @Param('id', ParseIntPipe) id: number,
        @Query('expiry_date') expiry_date: string,
        @Req() request: Request,
    ): Promise<{ success: boolean }> {
        const requestInfo = createRequestInfo(request);
        await this.retirePolicyUseCase.execute(id, new Date(expiry_date), requestInfo);
        return { success: true };
    }

    @Version('1')
    @Get()
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
    @RequirePermissions(PERMISSIONS.LEAVE_POLICIES.READ)
    @ApiOperation({ summary: 'Get paginated list of leave policies' })
    @ApiResponse({
        status: 200,
        description: 'Leave policies retrieved successfully',
    })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async getPaginated(
        @Query() query: PaginationQueryDto,
    ): Promise<PaginatedResult<LeavePolicy>> {
        return this.getPaginatedLeavePolicyUseCase.execute(
            query.term ?? '',
            query.page,
            query.limit,
            query.is_archived === 'true',
        );
    }

    @Version('1')
    @Get('by-leave-type-code')
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
    @RequirePermissions(PERMISSIONS.LEAVE_POLICIES.READ)
    @ApiOperation({ summary: 'Get active leave policy by leave type code' })
    @ApiParam({ name: 'leave_type_code', description: 'Leave type code', example: 'VL' })
    @ApiResponse({ status: 200, description: 'Active leave policy retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Active leave policy not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async getActivePolicyByLeaveTypeCode(
        @Query('leave_type_code') leave_type_code: string,
    ): Promise<LeavePolicy | null> {
        return this.getActivePolicyUseCase.execute(leave_type_code);
    }

    @Version('1')
    @Get('all/active')
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
    @RequirePermissions(PERMISSIONS.LEAVE_POLICIES.READ)
    @ApiOperation({ summary: 'Get all active leave policies' })
    @ApiResponse({ status: 200, description: 'Active leave policies retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Active leave policies not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async getAllActivePolicies(
    ): Promise<LeavePolicy[]> {
        return this.retrieveActivePoliciesUseCase.execute();
    }
}
