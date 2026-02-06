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
  ApiQuery,
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
  CreateEducationUseCase,
  UpdateEducationUseCase,
  ArchiveEducationUseCase,
  RestoreEducationUseCase,
  FindEmployeesEducationUseCase,
} from '../../application/use-cases/education';
import {
  CreateEducationDto as CreateEducationPresentationDto,
  UpdateEducationDto as UpdateEducationPresentationDto,
} from '../dto/education';
import {
  CreateEducationCommand,
  UpdateEducationCommand,
} from '../../application/commands/education';
import { Education } from '../../domain/models';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Education')
@Controller('educations')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class EducationController {
  constructor(
    private readonly createEducationUseCase: CreateEducationUseCase,
    private readonly updateEducationUseCase: UpdateEducationUseCase,
    private readonly archiveEducationUseCase: ArchiveEducationUseCase,
    private readonly restoreEducationUseCase: RestoreEducationUseCase,
    private readonly findEmployeesEducationUseCase: FindEmployeesEducationUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EDUCATIONS.CREATE)
  @ApiOperation({ summary: 'Create a new education record' })
  @ApiBody({ type: CreateEducationPresentationDto })
  @ApiResponse({
    status: 201,
    description: 'Education record created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateEducationPresentationDto,
    @Req() request: Request,
  ): Promise<Education> {
    const requestInfo = createRequestInfo(request);
    const command: CreateEducationCommand = {
      employee_id: presentationDto.employee_id,
      education_school_id: presentationDto.education_school_id,
      education_level_id: presentationDto.education_level_id,
      education_course_id: presentationDto.education_course_id,
      education_course_level_id: presentationDto.education_course_level_id,
      school_year: presentationDto.school_year,
    };
    return this.createEducationUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EDUCATIONS.READ)
  @ApiOperation({ summary: 'Get employee education records' })
  @ApiQuery({
    name: 'employee_id',
    required: true,
    description: 'Employee ID',
    example: '1',
  })
  @ApiQuery({
    name: 'is_archived',
    required: false,
    description: 'Filter by archived status',
    example: 'false',
  })
  @ApiResponse({
    status: 200,
    description: 'Employee education records retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async findEmployeesEducation(
    @Query('employee_id') employee_id: string,
    @Query('is_archived') is_archived?: string,
  ): Promise<{ data: Education[] }> {
    const parsedEmployeeId = parseInt(employee_id || '0', 10);
    const parsedIsArchived = is_archived === 'true';
    return this.findEmployeesEducationUseCase.execute(
      parsedEmployeeId,
      parsedIsArchived,
    );
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EDUCATIONS.UPDATE)
  @ApiOperation({ summary: 'Update education record information' })
  @ApiParam({
    name: 'id',
    description: 'Education record ID',
    example: 1,
  })
  @ApiBody({ type: UpdateEducationPresentationDto })
  @ApiResponse({
    status: 200,
    description: 'Education record updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Education record not found',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateEducationPresentationDto,
    @Req() request: Request,
  ): Promise<Education | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateEducationCommand = {
      education_school_id: presentationDto.education_school_id,
      education_level_id: presentationDto.education_level_id,
      education_course_id: presentationDto.education_course_id,
      education_course_level_id: presentationDto.education_course_level_id,
      school_year: presentationDto.school_year,
    };
    return this.updateEducationUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EDUCATIONS.ARCHIVE)
  @ApiOperation({ summary: 'Archive an education record' })
  @ApiParam({
    name: 'id',
    description: 'Education record ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Education record archived successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Education record not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveEducationUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EDUCATIONS.RESTORE)
  @ApiOperation({ summary: 'Restore an education record' })
  @ApiParam({
    name: 'id',
    description: 'Education record ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Education record restored successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Education record not found',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreEducationUseCase.execute(id, requestInfo);
    return { success: true };
  }
}
