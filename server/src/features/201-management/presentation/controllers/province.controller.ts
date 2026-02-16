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
  CreateProvinceUseCase,
  UpdateProvinceUseCase,
  ArchiveProvinceUseCase,
  RestoreProvinceUseCase,
  GetPaginatedProvinceUseCase,
  ComboboxProvinceUseCase,
} from '../../application/use-cases/province';
import {
  CreateProvinceDto as CreateProvincePresentationDto,
  UpdateProvinceDto as UpdateProvincePresentationDto,
} from '../dto/province';
import {
  CreateProvinceCommand,
  UpdateProvinceCommand,
} from '../../application/commands/province';
import { Province } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Province')
@Controller('provinces')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class ProvinceController {
  constructor(
    private readonly createProvinceUseCase: CreateProvinceUseCase,
    private readonly updateProvinceUseCase: UpdateProvinceUseCase,
    private readonly archiveProvinceUseCase: ArchiveProvinceUseCase,
    private readonly restoreProvinceUseCase: RestoreProvinceUseCase,
    private readonly getPaginatedProvinceUseCase: GetPaginatedProvinceUseCase,
    private readonly comboboxProvinceUseCase: ComboboxProvinceUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.PROVINCES.CREATE)
  @ApiOperation({ summary: 'Create a new province' })
  @ApiBody({ type: CreateProvincePresentationDto })
  @ApiResponse({ status: 201, description: 'Province created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateProvincePresentationDto,
    @Req() request: Request,
  ): Promise<Province> {
    const requestInfo = createRequestInfo(request);
    const command: CreateProvinceCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createProvinceUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.PROVINCES.UPDATE)
  @ApiOperation({ summary: 'Update province information' })
  @ApiParam({ name: 'id', description: 'Province ID', example: 1 })
  @ApiBody({ type: UpdateProvincePresentationDto })
  @ApiResponse({ status: 200, description: 'Province updated successfully' })
  @ApiResponse({ status: 404, description: 'Province not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateProvincePresentationDto,
    @Req() request: Request,
  ): Promise<Province | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateProvinceCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateProvinceUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.PROVINCES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a province' })
  @ApiParam({ name: 'id', description: 'Province ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Province archived successfully' })
  @ApiResponse({ status: 404, description: 'Province not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveProvinceUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.PROVINCES.RESTORE)
  @ApiOperation({ summary: 'Restore a province' })
  @ApiParam({ name: 'id', description: 'Province ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Province restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Province not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreProvinceUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.PROVINCES.READ)
  @ApiOperation({ summary: 'Get paginated list of provinces' })
  @ApiResponse({
    status: 200,
    description: 'Provinces retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<Province>> {
    return this.getPaginatedProvinceUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.PROVINCES.READ)
  @ApiOperation({ summary: 'Get provinces combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Provinces combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxProvinceUseCase.execute();
  }
}
