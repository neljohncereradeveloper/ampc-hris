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
  CreateJobtitleUseCase,
  UpdateJobtitleUseCase,
  ArchiveJobtitleUseCase,
  RestoreJobtitleUseCase,
  GetPaginatedJobtitleUseCase,
  ComboboxJobtitleUseCase,
} from '../../application/use-cases/jobtitle';
import {
  CreateJobtitleDto as CreateJobtitlePresentationDto,
  UpdateJobtitleDto as UpdateJobtitlePresentationDto,
} from '../dto/jobtitle';
import {
  CreateJobtitleCommand,
  UpdateJobtitleCommand,
} from '../../application/commands/jobtitle';
import { Jobtitle } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Jobtitle')
@Controller('jobtitles')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class JobtitleController {
  constructor(
    private readonly createJobtitleUseCase: CreateJobtitleUseCase,
    private readonly updateJobtitleUseCase: UpdateJobtitleUseCase,
    private readonly archiveJobtitleUseCase: ArchiveJobtitleUseCase,
    private readonly restoreJobtitleUseCase: RestoreJobtitleUseCase,
    private readonly getPaginatedJobtitleUseCase: GetPaginatedJobtitleUseCase,
    private readonly comboboxJobtitleUseCase: ComboboxJobtitleUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.JOBTITLES.CREATE)
  @ApiOperation({ summary: 'Create a new jobtitle' })
  @ApiBody({ type: CreateJobtitlePresentationDto })
  @ApiResponse({ status: 201, description: 'Jobtitle created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateJobtitlePresentationDto,
    @Req() request: Request,
  ): Promise<Jobtitle> {
    const requestInfo = createRequestInfo(request);
    const command: CreateJobtitleCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createJobtitleUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.JOBTITLES.UPDATE)
  @ApiOperation({ summary: 'Update jobtitle information' })
  @ApiParam({ name: 'id', description: 'Jobtitle ID', example: 1 })
  @ApiBody({ type: UpdateJobtitlePresentationDto })
  @ApiResponse({ status: 200, description: 'Jobtitle updated successfully' })
  @ApiResponse({ status: 404, description: 'Jobtitle not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateJobtitlePresentationDto,
    @Req() request: Request,
  ): Promise<Jobtitle | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateJobtitleCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateJobtitleUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.JOBTITLES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a jobtitle' })
  @ApiParam({ name: 'id', description: 'Jobtitle ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Jobtitle archived successfully' })
  @ApiResponse({ status: 404, description: 'Jobtitle not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveJobtitleUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.JOBTITLES.RESTORE)
  @ApiOperation({ summary: 'Restore a jobtitle' })
  @ApiParam({ name: 'id', description: 'Jobtitle ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Jobtitle restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Jobtitle not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreJobtitleUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.JOBTITLES.READ)
  @ApiOperation({ summary: 'Get paginated list of jobtitles' })
  @ApiResponse({
    status: 200,
    description: 'Jobtitles retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<Jobtitle>> {
    return this.getPaginatedJobtitleUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.JOBTITLES.READ)
  @ApiOperation({ summary: 'Get jobtitles combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Jobtitles combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxJobtitleUseCase.execute();
  }
}
