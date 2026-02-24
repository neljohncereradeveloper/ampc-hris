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
  CreateEducationLevelUseCase,
  UpdateEducationLevelUseCase,
  ArchiveEducationLevelUseCase,
  RestoreEducationLevelUseCase,
  GetPaginatedEducationLevelUseCase,
  ComboboxEducationLevelUseCase,
} from '../../application/use-cases/education-level';
import {
  CreateEducationLevelDto as CreateEducationLevelPresentationDto,
  UpdateEducationLevelDto as UpdateEducationLevelPresentationDto,
} from '../dto/education-level';
import {
  CreateEducationLevelCommand,
  UpdateEducationLevelCommand,
} from '../../application/commands/education-level';
import { EducationLevel } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('EducationLevel')
@Controller('education-levels')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class EducationLevelController {
  constructor(
    private readonly createEducationLevelUseCase: CreateEducationLevelUseCase,
    private readonly updateEducationLevelUseCase: UpdateEducationLevelUseCase,
    private readonly archiveEducationLevelUseCase: ArchiveEducationLevelUseCase,
    private readonly restoreEducationLevelUseCase: RestoreEducationLevelUseCase,
    private readonly getPaginatedEducationLevelUseCase: GetPaginatedEducationLevelUseCase,
    private readonly comboboxEducationLevelUseCase: ComboboxEducationLevelUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EDUCATION_LEVELS.CREATE)
  @ApiOperation({ summary: 'Create a new EducationLevel' })
  @ApiBody({ type: CreateEducationLevelPresentationDto })
  @ApiResponse({
    status: 201,
    description: 'EducationLevel created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateEducationLevelPresentationDto,
    @Req() request: Request,
  ): Promise<EducationLevel> {
    const requestInfo = createRequestInfo(request);
    const command: CreateEducationLevelCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createEducationLevelUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.EDUCATION_LEVELS.UPDATE)
  @ApiOperation({ summary: 'Update EducationLevel information' })
  @ApiParam({ name: 'id', description: 'EducationLevel ID', example: 1 })
  @ApiBody({ type: UpdateEducationLevelPresentationDto })
  @ApiResponse({
    status: 200,
    description: 'EducationLevel updated successfully',
  })
  @ApiResponse({ status: 404, description: 'EducationLevel not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateEducationLevelPresentationDto,
    @Req() request: Request,
  ): Promise<EducationLevel | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateEducationLevelCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateEducationLevelUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EDUCATION_LEVELS.ARCHIVE)
  @ApiOperation({ summary: 'Archive a EducationLevel' })
  @ApiParam({ name: 'id', description: 'EducationLevel ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'EducationLevel archived successfully',
  })
  @ApiResponse({ status: 404, description: 'EducationLevel not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveEducationLevelUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.EDUCATION_LEVELS.RESTORE)
  @ApiOperation({ summary: 'Restore a EducationLevel' })
  @ApiParam({ name: 'id', description: 'EducationLevel ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'EducationLevel restored successfully',
  })
  @ApiResponse({ status: 404, description: 'EducationLevel not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreEducationLevelUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EDUCATION_LEVELS.READ)
  @ApiOperation({ summary: 'Get paginated list of EducationLevels' })
  @ApiResponse({
    status: 200,
    description: 'EducationLevels retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<EducationLevel>> {
    return this.getPaginatedEducationLevelUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.EDUCATION_LEVELS.READ)
  @ApiOperation({ summary: 'Get EducationLevelss combobox list' })
  @ApiResponse({
    status: 200,
    description: 'EducationLevels combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxEducationLevelUseCase.execute();
  }
}
