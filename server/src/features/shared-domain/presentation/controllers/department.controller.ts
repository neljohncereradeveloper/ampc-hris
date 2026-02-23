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
  CreateDepartmentUseCase,
  UpdateDepartmentUseCase,
  ArchiveDepartmentUseCase,
  RestoreDepartmentUseCase,
  GetPaginatedDepartmentUseCase,
  ComboboxDepartmentUseCase,
} from '../../application/use-cases/department';
import {
  CreateDepartmentDto as CreateDepartmentPresentationDto,
  UpdateDepartmentDto as UpdateDepartmentPresentationDto,
} from '../dto/department';
import {
  CreateDepartmentCommand,
  UpdateDepartmentCommand,
} from '../../application/commands/department';
import { Department } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Department')
@Controller('departments')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class DepartmentController {
  constructor(
    private readonly createDepartmentUseCase: CreateDepartmentUseCase,
    private readonly updateDepartmentUseCase: UpdateDepartmentUseCase,
    private readonly archiveDepartmentUseCase: ArchiveDepartmentUseCase,
    private readonly restoreDepartmentUseCase: RestoreDepartmentUseCase,
    private readonly getPaginatedDepartmentUseCase: GetPaginatedDepartmentUseCase,
    private readonly comboboxDepartmentUseCase: ComboboxDepartmentUseCase,
  ) { }

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.DEPARTMENTS.CREATE)
  @ApiOperation({ summary: 'Create a new department' })
  @ApiBody({ type: CreateDepartmentPresentationDto })
  @ApiResponse({ status: 201, description: 'Department created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateDepartmentPresentationDto,
    @Req() request: Request,
  ): Promise<Department> {
    const requestInfo = createRequestInfo(request);
    const command: CreateDepartmentCommand = {
      desc1: presentationDto.desc1,
      code: presentationDto.code,
      scope: presentationDto.scope,
      remarks: presentationDto.remarks,
    };
    return this.createDepartmentUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.DEPARTMENTS.UPDATE)
  @ApiOperation({ summary: 'Update department information' })
  @ApiParam({ name: 'id', description: 'Department ID', example: 1 })
  @ApiBody({ type: UpdateDepartmentPresentationDto })
  @ApiResponse({ status: 200, description: 'Department updated successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateDepartmentPresentationDto,
    @Req() request: Request,
  ): Promise<Department | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateDepartmentCommand = {
      desc1: presentationDto.desc1,
      code: presentationDto.code,
      scope: presentationDto.scope,
      remarks: presentationDto.remarks,
    };
    return this.updateDepartmentUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.DEPARTMENTS.ARCHIVE)
  @ApiOperation({ summary: 'Archive a department' })
  @ApiParam({ name: 'id', description: 'Department ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Department archived successfully' })
  @ApiResponse({ status: 404, description: 'Department not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveDepartmentUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.DEPARTMENTS.RESTORE)
  @ApiOperation({ summary: 'Restore a department' })
  @ApiParam({ name: 'id', description: 'Department ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Department restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Department not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreDepartmentUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.DEPARTMENTS.READ)
  @ApiOperation({ summary: 'Get paginated list of departments' })
  @ApiResponse({
    status: 200,
    description: 'Departments retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<Department>> {
    return this.getPaginatedDepartmentUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.DEPARTMENTS.READ)
  @ApiOperation({ summary: 'Get departments combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Departments combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxDepartmentUseCase.execute();
  }
}
