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
  CreateEducationCourseLevelUseCase,
  UpdateEducationCourseLevelUseCase,
  ArchiveEducationCourseLevelUseCase,
  RestoreEducationCourseLevelUseCase,
  GetPaginatedEducationCourseLevelUseCase,
  ComboboxEducationCourseLevelUseCase,
} from '../../application/use-cases/education-course-level';
import {
  CreateEducationCourseLevelDto as CreateEducationCourseLevelPresentationDto,
  UpdateEducationCourseLevelDto as UpdateEducationCourseLevelPresentationDto,
} from '../dto/education-course-level';
import {
  CreateEducationCourseLevelCommand,
  UpdateEducationCourseLevelCommand,
} from '../../application/commands/education-course-level';
import { EducationCourseLevel } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('EducationCourseLevel')
@Controller('education-course-levels')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class EducationCourseLevelController {
  constructor(
    private readonly createEducationCourseLevelUseCase: CreateEducationCourseLevelUseCase,
    private readonly updateEducationCourseLevelUseCase: UpdateEducationCourseLevelUseCase,
    private readonly archiveEducationCourseLevelUseCase: ArchiveEducationCourseLevelUseCase,
    private readonly restoreEducationCourseLevelUseCase: RestoreEducationCourseLevelUseCase,
    private readonly getPaginatedEducationCourseLevelUseCase: GetPaginatedEducationCourseLevelUseCase,
    private readonly comboboxEducationCourseLevelUseCase: ComboboxEducationCourseLevelUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSE_LEVELS.CREATE)
  @ApiOperation({ summary: 'Create a new EducationCourseLevel' })
  @ApiBody({ type: CreateEducationCourseLevelPresentationDto })
  @ApiResponse({
    status: 201,
    description: 'EducationCourseLevel created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateEducationCourseLevelPresentationDto,
    @Req() request: Request,
  ): Promise<EducationCourseLevel> {
    const requestInfo = createRequestInfo(request);
    const command: CreateEducationCourseLevelCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createEducationCourseLevelUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSE_LEVELS.UPDATE)
  @ApiOperation({ summary: 'Update EducationCourseLevel information' })
  @ApiParam({ name: 'id', description: 'EducationCourseLevel ID', example: 1 })
  @ApiBody({ type: UpdateEducationCourseLevelPresentationDto })
  @ApiResponse({
    status: 200,
    description: 'EducationCourseLevel updated successfully',
  })
  @ApiResponse({ status: 404, description: 'EducationCourseLevel not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateEducationCourseLevelPresentationDto,
    @Req() request: Request,
  ): Promise<EducationCourseLevel | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateEducationCourseLevelCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateEducationCourseLevelUseCase.execute(
      id,
      command,
      requestInfo,
    );
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSE_LEVELS.ARCHIVE)
  @ApiOperation({ summary: 'Archive a EducationCourseLevel' })
  @ApiParam({ name: 'id', description: 'EducationCourseLevel ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'EducationCourseLevel archived successfully',
  })
  @ApiResponse({ status: 404, description: 'EducationCourseLevel not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveEducationCourseLevelUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSE_LEVELS.RESTORE)
  @ApiOperation({ summary: 'Restore a EducationCourseLevel' })
  @ApiParam({ name: 'id', description: 'EducationCourseLevel ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'EducationCourseLevel restored successfully',
  })
  @ApiResponse({ status: 404, description: 'EducationCourseLevel not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreEducationCourseLevelUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSE_LEVELS.READ)
  @ApiOperation({ summary: 'Get paginated list of EducationCourseLevels' })
  @ApiResponse({
    status: 200,
    description: 'EducationCourseLevels retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<EducationCourseLevel>> {
    return this.getPaginatedEducationCourseLevelUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSE_LEVELS.READ)
  @ApiOperation({ summary: 'Get EducationCourseLevelss combobox list' })
  @ApiResponse({
    status: 200,
    description: 'EducationCourseLevels combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxEducationCourseLevelUseCase.execute();
  }
}
