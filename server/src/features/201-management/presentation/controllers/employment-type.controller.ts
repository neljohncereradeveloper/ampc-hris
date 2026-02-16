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
  CreateEmploymentTypeUseCase,
  UpdateEmploymentTypeUseCase,
  ArchiveEmploymentTypeUseCase,
  RestoreEmploymentTypeUseCase,
  GetPaginatedEmploymentTypeUseCase,
  ComboboxEmploymentTypeUseCase,
} from '../../application/use-cases/employment-type';
import {
  CreateEmploymentTypeDto as CreateEmploymentTypePresentationDto,
  UpdateEmploymentTypeDto as UpdateEmploymentTypePresentationDto,
} from '../dto/employment-type';
import {
  CreateEmploymentTypeCommand,
  UpdateEmploymentTypeCommand,
} from '../../application/commands/employment-type';
import { EmploymentType } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Employment Type')
@Controller('employment-types')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class EmploymentTypeController {
  constructor(
    private readonly createEmploymentTypeUseCase: CreateEmploymentTypeUseCase,
    private readonly updateEmploymentTypeUseCase: UpdateEmploymentTypeUseCase,
    private readonly archiveEmploymentTypeUseCase: ArchiveEmploymentTypeUseCase,
    private readonly restoreEmploymentTypeUseCase: RestoreEmploymentTypeUseCase,
    private readonly getPaginatedEmploymentTypeUseCase: GetPaginatedEmploymentTypeUseCase,
    private readonly comboboxEmploymentTypeUseCase: ComboboxEmploymentTypeUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_TYPES.CREATE)
  @ApiOperation({ summary: 'Create a new employment type' })
  @ApiBody({ type: CreateEmploymentTypePresentationDto })
  @ApiResponse({
    status: 201,
    description: 'Employment type created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateEmploymentTypePresentationDto,
    @Req() request: Request,
  ): Promise<EmploymentType> {
    const requestInfo = createRequestInfo(request);
    const command: CreateEmploymentTypeCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createEmploymentTypeUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_TYPES.UPDATE)
  @ApiOperation({ summary: 'Update employment type information' })
  @ApiParam({ name: 'id', description: 'Employment type ID', example: 1 })
  @ApiBody({ type: UpdateEmploymentTypePresentationDto })
  @ApiResponse({
    status: 200,
    description: 'Employment type updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Employment type not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateEmploymentTypePresentationDto,
    @Req() request: Request,
  ): Promise<EmploymentType | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateEmploymentTypeCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateEmploymentTypeUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_TYPES.ARCHIVE)
  @ApiOperation({ summary: 'Archive an employment type' })
  @ApiParam({ name: 'id', description: 'Employment type ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Employment type archived successfully',
  })
  @ApiResponse({ status: 404, description: 'Employment type not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveEmploymentTypeUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_TYPES.RESTORE)
  @ApiOperation({ summary: 'Restore an employment type' })
  @ApiParam({ name: 'id', description: 'Employment type ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Employment type restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Employment type not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreEmploymentTypeUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_TYPES.READ)
  @ApiOperation({ summary: 'Get paginated list of employment types' })
  @ApiResponse({
    status: 200,
    description: 'Employment types retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<EmploymentType>> {
    return this.getPaginatedEmploymentTypeUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EMPLOYMENT_TYPES.READ)
  @ApiOperation({ summary: 'Get employment types combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Employment types combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxEmploymentTypeUseCase.execute();
  }
}
