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
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';
import { createRequestInfo } from '@/core/utils/request-info.util';
import {
  RequirePermissions,
  RequireRoles,
} from '@/features/auth/infrastructure/decorators';
import { PERMISSIONS, ROLES } from '@/core/domain/constants';
import {
  CreateWorkExperienceUseCase,
  UpdateWorkExperienceUseCase,
  ArchiveWorkExperienceUseCase,
  RestoreWorkExperienceUseCase,
  GetPaginatedWorkExperienceUseCase,
} from '../../application/use-cases/work-experience';
import {
  CreateWorkExperienceDto as CreateWorkExperiencePresentationDto,
  UpdateWorkExperienceDto as UpdateWorkExperiencePresentationDto,
} from '../dto/work-experience';
import {
  CreateWorkExperienceCommand,
  UpdateWorkExperienceCommand,
} from '../../application/commands/work-experience';
import { WorkExperience } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';
import { PaginationWorkExperienceQueryDto } from '../dto/work-experience/pagination-work-experience-query.dto';

@ApiTags('Work Experience')
@Controller('work-experiences')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class WorkExperienceController {
  constructor(
    private readonly createWorkExperienceUseCase: CreateWorkExperienceUseCase,
    private readonly updateWorkExperienceUseCase: UpdateWorkExperienceUseCase,
    private readonly archiveWorkExperienceUseCase: ArchiveWorkExperienceUseCase,
    private readonly restoreWorkExperienceUseCase: RestoreWorkExperienceUseCase,
    private readonly getPaginatedWorkExperienceUseCase: GetPaginatedWorkExperienceUseCase,
  ) { }

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCES.CREATE)
  @ApiOperation({ summary: 'Create a new work experience' })
  @ApiBody({ type: CreateWorkExperiencePresentationDto })
  @ApiResponse({
    status: 201,
    description: 'Work experience created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateWorkExperiencePresentationDto,
    @Req() request: Request,
  ): Promise<WorkExperience> {
    const requestInfo = createRequestInfo(request);
    const command: CreateWorkExperienceCommand = {
      employee_id: presentationDto.employee_id,
      company_id: presentationDto.company_id,
      work_experience_job_title_id:
        presentationDto.work_experience_job_title_id,
      years: presentationDto.years,
    };
    return this.createWorkExperienceUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCES.UPDATE)
  @ApiOperation({ summary: 'Update work experience information' })
  @ApiParam({
    name: 'id',
    description: 'Work experience ID',
    example: 1,
  })
  @ApiBody({ type: UpdateWorkExperiencePresentationDto })
  @ApiResponse({
    status: 200,
    description: 'Work experience updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Work experience not found',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateWorkExperiencePresentationDto,
    @Req() request: Request,
  ): Promise<WorkExperience | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateWorkExperienceCommand = {
      company_id: presentationDto.company_id,
      work_experience_job_title_id:
        presentationDto.work_experience_job_title_id,
      years: presentationDto.years,
    };
    return this.updateWorkExperienceUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a work experience' })
  @ApiParam({
    name: 'id',
    description: 'Work experience ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Work experience archived successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Work experience not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveWorkExperienceUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCES.RESTORE)
  @ApiOperation({ summary: 'Restore a work experience' })
  @ApiParam({
    name: 'id',
    description: 'Work experience ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Work experience restored successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Work experience not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreWorkExperienceUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCES.READ)
  @ApiOperation({
    summary: 'Get paginated list of work experiences',
  })
  @ApiQuery({
    name: 'employee_id',
    required: true,
    type: Number,
    description: 'Filter by employee ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Work experiences retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationWorkExperienceQueryDto,
  ): Promise<PaginatedResult<WorkExperience>> {
    return this.getPaginatedWorkExperienceUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
      query.employee_id!,
    );
  }
}
