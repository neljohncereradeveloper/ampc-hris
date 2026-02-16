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
  CreateCivilStatusUseCase,
  UpdateCivilStatusUseCase,
  ArchiveCivilStatusUseCase,
  RestoreCivilStatusUseCase,
  GetPaginatedCivilStatusUseCase,
  ComboboxCivilStatusUseCase,
} from '../../application/use-cases/civil-status';
import {
  CreateCivilStatusDto as CreateCivilStatusPresentationDto,
  UpdateCivilStatusDto as UpdateCivilStatusPresentationDto,
} from '../dto/civil-status';
import {
  CreateCivilStatusCommand,
  UpdateCivilStatusCommand,
} from '../../application/commands/civil-status';
import { CivilStatus } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Civil Status')
@Controller('civil-statuses')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class CivilStatusController {
  constructor(
    private readonly createCivilStatusUseCase: CreateCivilStatusUseCase,
    private readonly updateCivilStatusUseCase: UpdateCivilStatusUseCase,
    private readonly archiveCivilStatusUseCase: ArchiveCivilStatusUseCase,
    private readonly restoreCivilStatusUseCase: RestoreCivilStatusUseCase,
    private readonly getPaginatedCivilStatusUseCase: GetPaginatedCivilStatusUseCase,
    private readonly comboboxCivilStatusUseCase: ComboboxCivilStatusUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.CIVIL_STATUSES.CREATE)
  @ApiOperation({ summary: 'Create a new civil status' })
  @ApiBody({ type: CreateCivilStatusPresentationDto })
  @ApiResponse({
    status: 201,
    description: 'Civil status created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateCivilStatusPresentationDto,
    @Req() request: Request,
  ): Promise<CivilStatus> {
    const requestInfo = createRequestInfo(request);
    const command: CreateCivilStatusCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createCivilStatusUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.CIVIL_STATUSES.UPDATE)
  @ApiOperation({ summary: 'Update civil status information' })
  @ApiParam({ name: 'id', description: 'Civil status ID', example: 1 })
  @ApiBody({ type: UpdateCivilStatusPresentationDto })
  @ApiResponse({
    status: 200,
    description: 'Civil status updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Civil status not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateCivilStatusPresentationDto,
    @Req() request: Request,
  ): Promise<CivilStatus | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateCivilStatusCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateCivilStatusUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.CIVIL_STATUSES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a civil status' })
  @ApiParam({ name: 'id', description: 'Civil status ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Civil status archived successfully',
  })
  @ApiResponse({ status: 404, description: 'Civil status not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveCivilStatusUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.CIVIL_STATUSES.RESTORE)
  @ApiOperation({ summary: 'Restore a civil status' })
  @ApiParam({ name: 'id', description: 'Civil status ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Civil status restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Civil status not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreCivilStatusUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.CIVIL_STATUSES.READ)
  @ApiOperation({ summary: 'Get paginated list of civil statuses' })
  @ApiResponse({
    status: 200,
    description: 'Civil statuses retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<CivilStatus>> {
    return this.getPaginatedCivilStatusUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.CIVIL_STATUSES.READ)
  @ApiOperation({ summary: 'Get civil statuses combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Civil statuses combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxCivilStatusUseCase.execute();
  }
}
