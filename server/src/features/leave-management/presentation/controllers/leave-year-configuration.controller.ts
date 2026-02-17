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
import { LeaveYearConfiguration } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
    RATE_LIMIT_MODERATE,
    RateLimit,
} from '@/core/infrastructure/decorators';
import {
    CreateLeaveYearConfigurationUseCase,
    UpdateLeaveYearConfigurationUseCase,
    ArchiveLeaveYearConfigurationUseCase,
    RestoreLeaveYearConfigurationUseCase,
    GetPaginatedLeaveYearConfigurationUseCase,
    FindActiveLeaveYearForDateUseCase
} from '../../application/use-cases/leave-year-configuration';
import { CreateLeaveYearConfigurationDto } from '../dto/leave-year-configuration/create-leave-configuration.dto';
import { CreateLeaveYearConfigurationCommand } from '../../application/commands/leave-year-configuration/create.command';
import { UpdateLeaveYearConfigurationDto } from '../dto/leave-year-configuration/update-leave-configuration.dto';
import { UpdateLeaveYearConfigurationCommand } from '../../application/commands/leave-year-configuration/update.command';

@ApiTags('Leave Year Configuration')
@Controller('leave-year-configurations')
@RateLimit({
    ...RATE_LIMIT_MODERATE,
    message: 'Too many requests. Please try again later.',
})
export class LeaveYearConfigurationController {
    constructor(
        private readonly createLeaveYearConfigurationUseCase: CreateLeaveYearConfigurationUseCase,
        private readonly updateLeaveYearConfigurationUseCase: UpdateLeaveYearConfigurationUseCase,
        private readonly archiveLeaveYearConfigurationUseCase: ArchiveLeaveYearConfigurationUseCase,
        private readonly restoreLeaveYearConfigurationUseCase: RestoreLeaveYearConfigurationUseCase,
        private readonly getPaginatedLeaveYearConfigurationUseCase: GetPaginatedLeaveYearConfigurationUseCase,
        private readonly findActiveLeaveYearForDateUseCase: FindActiveLeaveYearForDateUseCase,
    ) { }

    @Version('1')
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
    @RequirePermissions(PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.CREATE)
    @ApiOperation({ summary: 'Create a new leave year configuration' })
    @ApiBody({ type: CreateLeaveYearConfigurationDto })
    @ApiResponse({ status: 201, description: 'Leave year configuration created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async create(
        @Body() presentationDto: CreateLeaveYearConfigurationDto,
        @Req() request: Request,
    ): Promise<LeaveYearConfiguration> {
        const requestInfo = createRequestInfo(request);
        const command: CreateLeaveYearConfigurationCommand = {
            cutoff_start_date: presentationDto.cutoff_start_date,
            cutoff_end_date: presentationDto.cutoff_end_date,
            year: presentationDto.year,
            remarks: presentationDto.remarks,
        };
        return this.createLeaveYearConfigurationUseCase.execute(command, requestInfo);
    }

    @Version('1')
    @Put(':id')
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
    @RequirePermissions(PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.UPDATE)
    @ApiOperation({ summary: 'Update leave year configuration information' })
    @ApiParam({ name: 'id', description: 'Leave year configuration ID', example: 1 })
    @ApiBody({ type: UpdateLeaveYearConfigurationDto })
    @ApiResponse({ status: 200, description: 'Leave year configuration updated successfully' })
    @ApiResponse({ status: 404, description: 'Leave year configuration not found' })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() presentationDto: UpdateLeaveYearConfigurationDto,
        @Req() request: Request,
    ): Promise<LeaveYearConfiguration | null> {
        const requestInfo = createRequestInfo(request);
        const command: UpdateLeaveYearConfigurationCommand = {
            cutoff_start_date: presentationDto.cutoff_start_date,
            cutoff_end_date: presentationDto.cutoff_end_date,
            year: presentationDto.year,
            remarks: presentationDto.remarks,
        };
        return this.updateLeaveYearConfigurationUseCase.execute(id, command, requestInfo);
    }

    @Version('1')
    @Delete(':id/archive')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN)
    @RequirePermissions(PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.ARCHIVE)
    @ApiOperation({ summary: 'Archive a leave year configuration' })
    @ApiParam({ name: 'id', description: 'Leave year configuration ID', example: 1 })
    @ApiResponse({ status: 200, description: 'Leave year configuration archived successfully' })
    @ApiResponse({ status: 404, description: 'Leave year configuration not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async archive(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request,
    ): Promise<{ success: boolean }> {
        const requestInfo = createRequestInfo(request);
        await this.archiveLeaveYearConfigurationUseCase.execute(id, requestInfo);
        return { success: true };
    }

    @Version('1')
    @Patch(':id/restore')
    @HttpCode(HttpStatus.OK)
    @RequireRoles(ROLES.ADMIN)
    @RequirePermissions(PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.RESTORE)
    @ApiOperation({ summary: 'Restore a leave year configuration' })
    @ApiParam({ name: 'id', description: 'Leave year configuration ID', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Leave year configuration restored successfully',
    })
    @ApiResponse({ status: 404, description: 'Leave year configuration not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async restore(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: Request,
    ): Promise<{ success: boolean }> {
        const requestInfo = createRequestInfo(request);
        await this.restoreLeaveYearConfigurationUseCase.execute(id, requestInfo);
        return { success: true };
    }

    @Version('1')
    @Get()
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
    @RequirePermissions(PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.READ)
    @ApiOperation({ summary: 'Get paginated list of leave year configurations' })
    @ApiResponse({
        status: 200,
        description: 'Leave year configurations retrieved successfully',
    })
    @ApiResponse({ status: 400, description: 'Bad request - validation error' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async getPaginated(
        @Query() query: PaginationQueryDto,
    ): Promise<PaginatedResult<LeaveYearConfiguration>> {
        return this.getPaginatedLeaveYearConfigurationUseCase.execute(
            query.term ?? '',
            query.page,
            query.limit,
            query.is_archived === 'true',
        );
    }

    @Version('1')
    @Get('active-for-date')
    @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
    @RequirePermissions(PERMISSIONS.LEAVE_YEAR_CONFIGURATIONS.READ)
    @ApiOperation({ summary: 'Get active leave year configuration for a given date' })
    @ApiParam({ name: 'date', description: 'Date to check', example: '2025-01-01' })
    @ApiResponse({ status: 200, description: 'Active leave year configuration retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Active leave year configuration not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth('JWT-auth')
    async findActiveForDate(
        @Query('date') date: string,
    ): Promise<LeaveYearConfiguration | null> {
        return this.findActiveLeaveYearForDateUseCase.execute(new Date(date));
    }
}
