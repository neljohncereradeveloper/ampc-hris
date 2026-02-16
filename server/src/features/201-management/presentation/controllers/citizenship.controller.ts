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
  CreateCitizenshipUseCase,
  UpdateCitizenshipUseCase,
  ArchiveCitizenshipUseCase,
  RestoreCitizenshipUseCase,
  GetPaginatedCitizenshipUseCase,
  ComboboxCitizenshipUseCase,
} from '../../application/use-cases/citizenship';
import {
  CreateCitizenshipDto as CreateCitizenshipPresentationDto,
  UpdateCitizenshipDto as UpdateCitizenshipPresentationDto,
} from '../dto/citizenship';
import {
  CreateCitizenshipCommand,
  UpdateCitizenshipCommand,
} from '../../application/commands/citizenship';
import { Citizenship } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Citizenship')
@Controller('citizenships')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class CitizenshipController {
  constructor(
    private readonly createCitizenshipUseCase: CreateCitizenshipUseCase,
    private readonly updateCitizenshipUseCase: UpdateCitizenshipUseCase,
    private readonly archiveCitizenshipUseCase: ArchiveCitizenshipUseCase,
    private readonly restoreCitizenshipUseCase: RestoreCitizenshipUseCase,
    private readonly getPaginatedCitizenshipUseCase: GetPaginatedCitizenshipUseCase,
    private readonly comboboxCitizenshipUseCase: ComboboxCitizenshipUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.CITIZENSHIPS.CREATE)
  @ApiOperation({ summary: 'Create a new citizenship' })
  @ApiBody({ type: CreateCitizenshipPresentationDto })
  @ApiResponse({ status: 201, description: 'Citizenship created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateCitizenshipPresentationDto,
    @Req() request: Request,
  ): Promise<Citizenship> {
    const requestInfo = createRequestInfo(request);
    const command: CreateCitizenshipCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createCitizenshipUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.CITIZENSHIPS.UPDATE)
  @ApiOperation({ summary: 'Update citizenship information' })
  @ApiParam({ name: 'id', description: 'Citizenship ID', example: 1 })
  @ApiBody({ type: UpdateCitizenshipPresentationDto })
  @ApiResponse({ status: 200, description: 'Citizenship updated successfully' })
  @ApiResponse({ status: 404, description: 'Citizenship not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateCitizenshipPresentationDto,
    @Req() request: Request,
  ): Promise<Citizenship | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateCitizenshipCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateCitizenshipUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.CITIZENSHIPS.ARCHIVE)
  @ApiOperation({ summary: 'Archive a citizenship' })
  @ApiParam({ name: 'id', description: 'Citizenship ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Citizenship archived successfully',
  })
  @ApiResponse({ status: 404, description: 'Citizenship not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveCitizenshipUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.CITIZENSHIPS.RESTORE)
  @ApiOperation({ summary: 'Restore a citizenship' })
  @ApiParam({ name: 'id', description: 'Citizenship ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Citizenship restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Citizenship not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreCitizenshipUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.CITIZENSHIPS.READ)
  @ApiOperation({ summary: 'Get paginated list of citizenships' })
  @ApiResponse({
    status: 200,
    description: 'Citizenships retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<Citizenship>> {
    return this.getPaginatedCitizenshipUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.CITIZENSHIPS.READ)
  @ApiOperation({ summary: 'Get citizenships combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Citizenships combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxCitizenshipUseCase.execute();
  }
}
