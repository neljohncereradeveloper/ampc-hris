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
  CreateEducationCourseUseCase,
  UpdateEducationCourseUseCase,
  ArchiveEducationCourseUseCase,
  RestoreEducationCourseUseCase,
  GetPaginatedEducationCourseUseCase,
  ComboboxEducationCourseUseCase,
} from '../../application/use-cases/education-course';
import {
  CreateEducationCourseDto as CreateEducationCoursePresentationDto,
  UpdateEducationCourseDto as UpdateEducationCoursePresentationDto,
} from '../dto/education-course';
import {
  CreateEducationCourseCommand,
  UpdateEducationCourseCommand,
} from '../../application/commands/education-course';
import { EducationCourse } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Education Course')
@Controller('education-courses')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class EducationCourseController {
  constructor(
    private readonly createEducationCourseUseCase: CreateEducationCourseUseCase,
    private readonly updateEducationCourseUseCase: UpdateEducationCourseUseCase,
    private readonly archiveEducationCourseUseCase: ArchiveEducationCourseUseCase,
    private readonly restoreEducationCourseUseCase: RestoreEducationCourseUseCase,
    private readonly getPaginatedEducationCourseUseCase: GetPaginatedEducationCourseUseCase,
    private readonly comboboxEducationCourseUseCase: ComboboxEducationCourseUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSES.CREATE)
  @ApiOperation({ summary: 'Create a new education course' })
  @ApiBody({ type: CreateEducationCoursePresentationDto })
  @ApiResponse({
    status: 201,
    description: 'Education course created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateEducationCoursePresentationDto,
    @Req() request: Request,
  ): Promise<EducationCourse> {
    const requestInfo = createRequestInfo(request);
    const command: CreateEducationCourseCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createEducationCourseUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSES.UPDATE)
  @ApiOperation({ summary: 'Update education course information' })
  @ApiParam({
    name: 'id',
    description: 'Education course ID',
    example: 1,
  })
  @ApiBody({ type: UpdateEducationCoursePresentationDto })
  @ApiResponse({
    status: 200,
    description: 'Education course updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Education course not found',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateEducationCoursePresentationDto,
    @Req() request: Request,
  ): Promise<EducationCourse | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateEducationCourseCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateEducationCourseUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSES.ARCHIVE)
  @ApiOperation({ summary: 'Archive an education course' })
  @ApiParam({
    name: 'id',
    description: 'Education course ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Education course archived successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Education course not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveEducationCourseUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSES.RESTORE)
  @ApiOperation({ summary: 'Restore an education course' })
  @ApiParam({
    name: 'id',
    description: 'Education course ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Education course restored successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Education course not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreEducationCourseUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSES.READ)
  @ApiOperation({
    summary: 'Get paginated list of education courses',
  })
  @ApiResponse({
    status: 200,
    description: 'Education courses retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<EducationCourse>> {
    return this.getPaginatedEducationCourseUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EDUCATION_COURSES.READ)
  @ApiOperation({
    summary: 'Get education courses combobox list',
  })
  @ApiResponse({
    status: 200,
    description: 'Education courses combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxEducationCourseUseCase.execute();
  }
}
