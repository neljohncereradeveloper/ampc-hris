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
  CreateReligionUseCase,
  UpdateReligionUseCase,
  ArchiveReligionUseCase,
  RestoreReligionUseCase,
  GetPaginatedReligionUseCase,
  ComboboxReligionUseCase,
} from '../../application/use-cases/religion';
import {
  CreateReligionDto as CreateReligionPresentationDto,
  UpdateReligionDto as UpdateReligionPresentationDto,
} from '../dto/religion';
import {
  CreateReligionCommand,
  UpdateReligionCommand,
} from '../../application/commands/religion';
import { Religion } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import { RATE_LIMIT_MODERATE, RateLimit } from '@/core/infrastructure/decorators';

@ApiTags('Religion')
@Controller('religions')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class ReligionController {
  constructor(
    private readonly createReligionUseCase: CreateReligionUseCase,
    private readonly updateReligionUseCase: UpdateReligionUseCase,
    private readonly archiveReligionUseCase: ArchiveReligionUseCase,
    private readonly restoreReligionUseCase: RestoreReligionUseCase,
    private readonly getPaginatedReligionUseCase: GetPaginatedReligionUseCase,
    private readonly comboboxReligionUseCase: ComboboxReligionUseCase,
  ) { }

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.RELIGIONS.CREATE)
  @ApiOperation({ summary: 'Create a new religion' })
  @ApiBody({ type: CreateReligionPresentationDto })
  @ApiResponse({ status: 201, description: 'Religion created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateReligionPresentationDto,
    @Req() request: Request,
  ): Promise<Religion> {
    const requestInfo = createRequestInfo(request);
    const command: CreateReligionCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createReligionUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.RELIGIONS.UPDATE)
  @ApiOperation({ summary: 'Update religion information' })
  @ApiParam({ name: 'id', description: 'Religion ID', example: 1 })
  @ApiBody({ type: UpdateReligionPresentationDto })
  @ApiResponse({ status: 200, description: 'Religion updated successfully' })
  @ApiResponse({ status: 404, description: 'Religion not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateReligionPresentationDto,
    @Req() request: Request,
  ): Promise<Religion | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateReligionCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateReligionUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.RELIGIONS.ARCHIVE)
  @ApiOperation({ summary: 'Archive a religion' })
  @ApiParam({ name: 'id', description: 'Religion ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Religion archived successfully' })
  @ApiResponse({ status: 404, description: 'Religion not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveReligionUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.RELIGIONS.RESTORE)
  @ApiOperation({ summary: 'Restore a religion' })
  @ApiParam({ name: 'id', description: 'Religion ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Religion restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Religion not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreReligionUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.RELIGIONS.READ)
  @ApiOperation({ summary: 'Get paginated list of religions' })
  @ApiResponse({
    status: 200,
    description: 'Religions retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<Religion>> {
    return this.getPaginatedReligionUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.RELIGIONS.READ)
  @ApiOperation({ summary: 'Get religions combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Religions combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxReligionUseCase.execute();
  }
}
