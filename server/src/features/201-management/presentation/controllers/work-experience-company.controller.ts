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
  CreateWorkExperienceCompanyUseCase,
  UpdateWorkExperienceCompanyUseCase,
  ArchiveWorkExperienceCompanyUseCase,
  RestoreWorkExperienceCompanyUseCase,
  GetPaginatedWorkExperienceCompanyUseCase,
  ComboboxWorkExperienceCompanyUseCase,
} from '../../application/use-cases/work-experience-company';
import {
  CreateWorkExperienceCompanyDto as CreateWorkExperienceCompanyPresentationDto,
  UpdateWorkExperienceCompanyDto as UpdateWorkExperienceCompanyPresentationDto,
} from '../dto/work-experience-company';
import {
  CreateWorkExperienceCompanyCommand,
  UpdateWorkExperienceCompanyCommand,
} from '../../application/commands/work-experience-company';
import { WorkExperienceCompany } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Work Experience Company')
@Controller('work-experience-companies')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class WorkExperienceCompanyController {
  constructor(
    private readonly createWorkExperienceCompanyUseCase: CreateWorkExperienceCompanyUseCase,
    private readonly updateWorkExperienceCompanyUseCase: UpdateWorkExperienceCompanyUseCase,
    private readonly archiveWorkExperienceCompanyUseCase: ArchiveWorkExperienceCompanyUseCase,
    private readonly restoreWorkExperienceCompanyUseCase: RestoreWorkExperienceCompanyUseCase,
    private readonly getPaginatedWorkExperienceCompanyUseCase: GetPaginatedWorkExperienceCompanyUseCase,
    private readonly comboboxWorkExperienceCompanyUseCase: ComboboxWorkExperienceCompanyUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_COMPANIES.CREATE)
  @ApiOperation({ summary: 'Create a new work experience company' })
  @ApiBody({ type: CreateWorkExperienceCompanyPresentationDto })
  @ApiResponse({
    status: 201,
    description: 'Work experience company created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateWorkExperienceCompanyPresentationDto,
    @Req() request: Request,
  ): Promise<WorkExperienceCompany> {
    const requestInfo = createRequestInfo(request);
    const command: CreateWorkExperienceCompanyCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createWorkExperienceCompanyUseCase.execute(
      command,
      requestInfo,
    );
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_COMPANIES.UPDATE)
  @ApiOperation({ summary: 'Update work experience company information' })
  @ApiParam({
    name: 'id',
    description: 'Work experience company ID',
    example: 1,
  })
  @ApiBody({ type: UpdateWorkExperienceCompanyPresentationDto })
  @ApiResponse({
    status: 200,
    description: 'Work experience company updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Work experience company not found',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateWorkExperienceCompanyPresentationDto,
    @Req() request: Request,
  ): Promise<WorkExperienceCompany | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateWorkExperienceCompanyCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateWorkExperienceCompanyUseCase.execute(
      id,
      command,
      requestInfo,
    );
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_COMPANIES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a work experience company' })
  @ApiParam({
    name: 'id',
    description: 'Work experience company ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Work experience company archived successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Work experience company not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveWorkExperienceCompanyUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_COMPANIES.RESTORE)
  @ApiOperation({ summary: 'Restore a work experience company' })
  @ApiParam({
    name: 'id',
    description: 'Work experience company ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Work experience company restored successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Work experience company not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreWorkExperienceCompanyUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_COMPANIES.READ)
  @ApiOperation({
    summary: 'Get paginated list of work experience companies',
  })
  @ApiResponse({
    status: 200,
    description: 'Work experience companies retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<WorkExperienceCompany>> {
    return this.getPaginatedWorkExperienceCompanyUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_COMPANIES.READ)
  @ApiOperation({
    summary: 'Get work experience companies combobox list',
  })
  @ApiResponse({
    status: 200,
    description: 'Work experience companies combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxWorkExperienceCompanyUseCase.execute();
  }
}
