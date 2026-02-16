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
  CreateBarangayUseCase,
  UpdateBarangayUseCase,
  ArchiveBarangayUseCase,
  RestoreBarangayUseCase,
  GetPaginatedBarangayUseCase,
  ComboboxBarangayUseCase,
} from '../../application/use-cases/barangay';
import {
  CreateBarangayDto as CreateBarangayPresentationDto,
  UpdateBarangayDto as UpdateBarangayPresentationDto,
} from '../dto/barangay';
import {
  CreateBarangayCommand,
  UpdateBarangayCommand,
} from '../../application/commands/barangay';
import { Barangay } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Barangay')
@Controller('barangays')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class BarangayController {
  constructor(
    private readonly createBarangayUseCase: CreateBarangayUseCase,
    private readonly updateBarangayUseCase: UpdateBarangayUseCase,
    private readonly archiveBarangayUseCase: ArchiveBarangayUseCase,
    private readonly restoreBarangayUseCase: RestoreBarangayUseCase,
    private readonly getPaginatedBarangayUseCase: GetPaginatedBarangayUseCase,
    private readonly comboboxBarangayUseCase: ComboboxBarangayUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.BARANGAYS.CREATE)
  @ApiOperation({ summary: 'Create a new barangay' })
  @ApiBody({ type: CreateBarangayPresentationDto })
  @ApiResponse({ status: 201, description: 'Barangay created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateBarangayPresentationDto,
    @Req() request: Request,
  ): Promise<Barangay> {
    const requestInfo = createRequestInfo(request);
    const command: CreateBarangayCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createBarangayUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.BARANGAYS.UPDATE)
  @ApiOperation({ summary: 'Update barangay information' })
  @ApiParam({ name: 'id', description: 'Barangay ID', example: 1 })
  @ApiBody({ type: UpdateBarangayPresentationDto })
  @ApiResponse({ status: 200, description: 'Barangay updated successfully' })
  @ApiResponse({ status: 404, description: 'Barangay not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateBarangayPresentationDto,
    @Req() request: Request,
  ): Promise<Barangay | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateBarangayCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateBarangayUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.BARANGAYS.ARCHIVE)
  @ApiOperation({ summary: 'Archive a barangay' })
  @ApiParam({ name: 'id', description: 'Barangay ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Barangay archived successfully' })
  @ApiResponse({ status: 404, description: 'Barangay not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveBarangayUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.BARANGAYS.RESTORE)
  @ApiOperation({ summary: 'Restore a barangay' })
  @ApiParam({ name: 'id', description: 'Barangay ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Barangay restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Barangay not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreBarangayUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.BARANGAYS.READ)
  @ApiOperation({ summary: 'Get paginated list of barangays' })
  @ApiResponse({
    status: 200,
    description: 'Barangays retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<Barangay>> {
    return this.getPaginatedBarangayUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.BARANGAYS.READ)
  @ApiOperation({ summary: 'Get barangays combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Barangays combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxBarangayUseCase.execute();
  }
}
