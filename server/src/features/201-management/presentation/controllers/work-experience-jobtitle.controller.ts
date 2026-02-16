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
  CreateWorkExperienceJobTitleUseCase,
  UpdateWorkExperienceJobTitleUseCase,
  ArchiveWorkExperienceJobTitleUseCase,
  RestoreWorkExperienceJobTitleUseCase,
  GetPaginatedWorkExperienceJobTitleUseCase,
  ComboboxWorkExperienceJobTitleUseCase,
} from '../../application/use-cases/work-experience-jobtitle';
import {
  CreateWorkExperienceJobTitleDto as CreateWorkExperienceJobTitlePresentationDto,
  UpdateWorkExperienceJobTitleDto as UpdateWorkExperienceJobTitlePresentationDto,
} from '../dto/work-experience-jobtitle';
import {
  CreateWorkExperienceJobTitleCommand,
  UpdateWorkExperienceJobTitleCommand,
} from '../../application/commands/work-experience-jobtitle';
import { WorkExperienceJobTitle } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Work Experience Job Title')
@Controller('work-experience-jobtitles')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class WorkExperienceJobTitleController {
  constructor(
    private readonly createWorkExperienceJobTitleUseCase: CreateWorkExperienceJobTitleUseCase,
    private readonly updateWorkExperienceJobTitleUseCase: UpdateWorkExperienceJobTitleUseCase,
    private readonly archiveWorkExperienceJobTitleUseCase: ArchiveWorkExperienceJobTitleUseCase,
    private readonly restoreWorkExperienceJobTitleUseCase: RestoreWorkExperienceJobTitleUseCase,
    private readonly getPaginatedWorkExperienceJobTitleUseCase: GetPaginatedWorkExperienceJobTitleUseCase,
    private readonly comboboxWorkExperienceJobTitleUseCase: ComboboxWorkExperienceJobTitleUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.CREATE)
  @ApiOperation({ summary: 'Create a new work experience job title' })
  @ApiBody({ type: CreateWorkExperienceJobTitlePresentationDto })
  @ApiResponse({
    status: 201,
    description: 'Work experience job title created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateWorkExperienceJobTitlePresentationDto,
    @Req() request: Request,
  ): Promise<WorkExperienceJobTitle> {
    const requestInfo = createRequestInfo(request);
    const command: CreateWorkExperienceJobTitleCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createWorkExperienceJobTitleUseCase.execute(
      command,
      requestInfo,
    );
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.UPDATE)
  @ApiOperation({ summary: 'Update work experience job title information' })
  @ApiParam({
    name: 'id',
    description: 'Work experience job title ID',
    example: 1,
  })
  @ApiBody({ type: UpdateWorkExperienceJobTitlePresentationDto })
  @ApiResponse({
    status: 200,
    description: 'Work experience job title updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Work experience job title not found',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateWorkExperienceJobTitlePresentationDto,
    @Req() request: Request,
  ): Promise<WorkExperienceJobTitle | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateWorkExperienceJobTitleCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateWorkExperienceJobTitleUseCase.execute(
      id,
      command,
      requestInfo,
    );
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a work experience job title' })
  @ApiParam({
    name: 'id',
    description: 'Work experience job title ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Work experience job title archived successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Work experience job title not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveWorkExperienceJobTitleUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.RESTORE)
  @ApiOperation({ summary: 'Restore a work experience job title' })
  @ApiParam({
    name: 'id',
    description: 'Work experience job title ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Work experience job title restored successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Work experience job title not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreWorkExperienceJobTitleUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.READ)
  @ApiOperation({
    summary: 'Get paginated list of work experience job titles',
  })
  @ApiResponse({
    status: 200,
    description: 'Work experience job titles retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<WorkExperienceJobTitle>> {
    return this.getPaginatedWorkExperienceJobTitleUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.WORK_EXPERIENCE_JOBTITLES.READ)
  @ApiOperation({
    summary: 'Get work experience job titles combobox list',
  })
  @ApiResponse({
    status: 200,
    description: 'Work experience job titles combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxWorkExperienceJobTitleUseCase.execute();
  }
}
