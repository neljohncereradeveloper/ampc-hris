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
  CreateEmploymentStatusUseCase,
  UpdateEmploymentStatusUseCase,
  ArchiveEmploymentStatusUseCase,
  RestoreEmploymentStatusUseCase,
  GetPaginatedEmploymentStatusUseCase,
  ComboboxEmploymentStatusUseCase,
} from '../../application/use-cases/employment-status';
import {
  CreateEmploymentStatusDto as CreateEmploymentStatusPresentationDto,
  UpdateEmploymentStatusDto as UpdateEmploymentStatusPresentationDto,
} from '../dto/employment-status';
import {
  CreateEmploymentStatusCommand,
  UpdateEmploymentStatusCommand,
} from '../../application/commands/employment-status';
import { EmploymentStatus } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Employment Status')
@Controller('employment-statuses')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class EmploymentStatusController {
  constructor(
    private readonly createEmploymentStatusUseCase: CreateEmploymentStatusUseCase,
    private readonly updateEmploymentStatusUseCase: UpdateEmploymentStatusUseCase,
    private readonly archiveEmploymentStatusUseCase: ArchiveEmploymentStatusUseCase,
    private readonly restoreEmploymentStatusUseCase: RestoreEmploymentStatusUseCase,
    private readonly getPaginatedEmploymentStatusUseCase: GetPaginatedEmploymentStatusUseCase,
    private readonly comboboxEmploymentStatusUseCase: ComboboxEmploymentStatusUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_STATUSES.CREATE)
  @ApiOperation({ summary: 'Create a new employment status' })
  @ApiBody({ type: CreateEmploymentStatusPresentationDto })
  @ApiResponse({
    status: 201,
    description: 'Employment status created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateEmploymentStatusPresentationDto,
    @Req() request: Request,
  ): Promise<EmploymentStatus> {
    const requestInfo = createRequestInfo(request);
    const command: CreateEmploymentStatusCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createEmploymentStatusUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_STATUSES.UPDATE)
  @ApiOperation({ summary: 'Update employment status information' })
  @ApiParam({ name: 'id', description: 'Employment status ID', example: 1 })
  @ApiBody({ type: UpdateEmploymentStatusPresentationDto })
  @ApiResponse({
    status: 200,
    description: 'Employment status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Employment status not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateEmploymentStatusPresentationDto,
    @Req() request: Request,
  ): Promise<EmploymentStatus | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateEmploymentStatusCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateEmploymentStatusUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_STATUSES.ARCHIVE)
  @ApiOperation({ summary: 'Archive an employment status' })
  @ApiParam({ name: 'id', description: 'Employment status ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Employment status archived successfully',
  })
  @ApiResponse({ status: 404, description: 'Employment status not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveEmploymentStatusUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_STATUSES.RESTORE)
  @ApiOperation({ summary: 'Restore an employment status' })
  @ApiParam({ name: 'id', description: 'Employment status ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Employment status restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Employment status not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreEmploymentStatusUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_STATUSES.READ)
  @ApiOperation({ summary: 'Get paginated list of employment statuses' })
  @ApiResponse({
    status: 200,
    description: 'Employment statuses retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<EmploymentStatus>> {
    return this.getPaginatedEmploymentStatusUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_STATUSES.READ)
  @ApiOperation({ summary: 'Get employment statuses combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Employment statuses combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxEmploymentStatusUseCase.execute();
  }
}
