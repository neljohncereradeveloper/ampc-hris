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
  CreateEducationSchoolUseCase,
  UpdateEducationSchoolUseCase,
  ArchiveEducationSchoolUseCase,
  RestoreEducationSchoolUseCase,
  GetPaginatedEducationSchoolUseCase,
  ComboboxEducationSchoolUseCase,
} from '../../application/use-cases/education-school';
import {
  CreateEducationSchoolDto as CreateEducationSchoolPresentationDto,
  UpdateEducationSchoolDto as UpdateEducationSchoolPresentationDto,
} from '../dto/education-school';
import {
  CreateEducationSchoolCommand,
  UpdateEducationSchoolCommand,
} from '../../application/commands/education-school';
import { EducationSchool } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('EducationSchool')
@Controller('education-schools')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class EducationSchoolController {
  constructor(
    private readonly createEducationSchoolUseCase: CreateEducationSchoolUseCase,
    private readonly updateEducationSchoolUseCase: UpdateEducationSchoolUseCase,
    private readonly archiveEducationSchoolUseCase: ArchiveEducationSchoolUseCase,
    private readonly restoreEducationSchoolUseCase: RestoreEducationSchoolUseCase,
    private readonly getPaginatedEducationSchoolUseCase: GetPaginatedEducationSchoolUseCase,
    private readonly comboboxEducationSchoolUseCase: ComboboxEducationSchoolUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EDUCATION_SCHOOLS.CREATE)
  @ApiOperation({ summary: 'Create a new EducationSchool' })
  @ApiBody({ type: CreateEducationSchoolPresentationDto })
  @ApiResponse({
    status: 201,
    description: 'EducationSchool created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateEducationSchoolPresentationDto,
    @Req() request: Request,
  ): Promise<EducationSchool> {
    const requestInfo = createRequestInfo(request);
    const command: CreateEducationSchoolCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createEducationSchoolUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EDUCATION_SCHOOLS.UPDATE)
  @ApiOperation({ summary: 'Update EducationSchool information' })
  @ApiParam({ name: 'id', description: 'EducationSchool ID', example: 1 })
  @ApiBody({ type: UpdateEducationSchoolPresentationDto })
  @ApiResponse({
    status: 200,
    description: 'EducationSchool updated successfully',
  })
  @ApiResponse({ status: 404, description: 'EducationSchool not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateEducationSchoolPresentationDto,
    @Req() request: Request,
  ): Promise<EducationSchool | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateEducationSchoolCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateEducationSchoolUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EDUCATION_SCHOOLS.ARCHIVE)
  @ApiOperation({ summary: 'Archive a EducationSchool' })
  @ApiParam({ name: 'id', description: 'EducationSchool ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'EducationSchool archived successfully',
  })
  @ApiResponse({ status: 404, description: 'EducationSchool not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveEducationSchoolUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EDUCATION_SCHOOLS.RESTORE)
  @ApiOperation({ summary: 'Restore a EducationSchool' })
  @ApiParam({ name: 'id', description: 'EducationSchool ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'EducationSchool restored successfully',
  })
  @ApiResponse({ status: 404, description: 'EducationSchool not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreEducationSchoolUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EDUCATION_SCHOOLS.READ)
  @ApiOperation({ summary: 'Get paginated list of EducationSchools' })
  @ApiResponse({
    status: 200,
    description: 'EducationSchools retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<EducationSchool>> {
    return this.getPaginatedEducationSchoolUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EDUCATION_SCHOOLS.READ)
  @ApiOperation({ summary: 'Get EducationSchoolss combobox list' })
  @ApiResponse({
    status: 200,
    description: 'EducationSchools combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxEducationSchoolUseCase.execute();
  }
}
