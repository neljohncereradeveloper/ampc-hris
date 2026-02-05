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
  CreateCityUseCase,
  UpdateCityUseCase,
  ArchiveCityUseCase,
  RestoreCityUseCase,
  GetCityByIdUseCase,
  GetPaginatedCityUseCase,
  ComboboxCityUseCase,
} from '../../application/use-cases/city';
import {
  CreateCityDto as CreateCityPresentationDto,
  UpdateCityDto as UpdateCityPresentationDto,
} from '../dto/city';
import {
  CreateCityCommand,
  UpdateCityCommand,
} from '../../application/commands/city';
import { City } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import { RATE_LIMIT_MODERATE, RateLimit } from '@/core/infrastructure/decorators';

@ApiTags('City')
@Controller('cities')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class CityController {
  constructor(
    private readonly createCityUseCase: CreateCityUseCase,
    private readonly updateCityUseCase: UpdateCityUseCase,
    private readonly archiveCityUseCase: ArchiveCityUseCase,
    private readonly restoreCityUseCase: RestoreCityUseCase,
    private readonly getCityByIdUseCase: GetCityByIdUseCase,
    private readonly getPaginatedCityUseCase: GetPaginatedCityUseCase,
    private readonly comboboxCityUseCase: ComboboxCityUseCase,
  ) { }

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.CITIES.CREATE)
  @ApiOperation({ summary: 'Create a new city' })
  @ApiBody({ type: CreateCityPresentationDto })
  @ApiResponse({ status: 201, description: 'City created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateCityPresentationDto,
    @Req() request: Request,
  ): Promise<City> {
    const requestInfo = createRequestInfo(request);
    const command: CreateCityCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createCityUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.CITIES.UPDATE)
  @ApiOperation({ summary: 'Update city information' })
  @ApiParam({ name: 'id', description: 'City ID', example: 1 })
  @ApiBody({ type: UpdateCityPresentationDto })
  @ApiResponse({ status: 200, description: 'City updated successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateCityPresentationDto,
    @Req() request: Request,
  ): Promise<City | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateCityCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateCityUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.CITIES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a city' })
  @ApiParam({ name: 'id', description: 'City ID', example: 1 })
  @ApiResponse({ status: 200, description: 'City archived successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveCityUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.CITIES.RESTORE)
  @ApiOperation({ summary: 'Restore a city' })
  @ApiParam({ name: 'id', description: 'City ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'City restored successfully',
  })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreCityUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.CITIES.READ)
  @ApiOperation({ summary: 'Get paginated list of cities' })
  @ApiResponse({
    status: 200,
    description: 'Cities retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<City>> {
    return this.getPaginatedCityUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.CITIES.READ)
  @ApiOperation({ summary: 'Get cities combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Cities combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxCityUseCase.execute();
  }

  @Version('1')
  @Get(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.CITIES.READ)
  @ApiOperation({ summary: 'Get city by ID' })
  @ApiParam({ name: 'id', description: 'City ID', example: 1 })
  @ApiResponse({ status: 200, description: 'City retrieved successfully' })
  @ApiResponse({ status: 404, description: 'City not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<City> {
    return this.getCityByIdUseCase.execute(id);
  }
}
