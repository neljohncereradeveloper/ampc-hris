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
  CreateBranchUseCase,
  UpdateBranchUseCase,
  ArchiveBranchUseCase,
  RestoreBranchUseCase,
  GetPaginatedBranchUseCase,
  ComboboxBranchUseCase,
} from '../../application/use-cases/branch';
import {
  CreateBranchDto as CreateBranchPresentationDto,
  UpdateBranchDto as UpdateBranchPresentationDto,
} from '../dto/branch';
import {
  CreateBranchCommand,
  UpdateBranchCommand,
} from '../../application/commands/branch';
import { Branch } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('Branch')
@Controller('branches')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class BranchController {
  constructor(
    private readonly createBranchUseCase: CreateBranchUseCase,
    private readonly updateBranchUseCase: UpdateBranchUseCase,
    private readonly archiveBranchUseCase: ArchiveBranchUseCase,
    private readonly restoreBranchUseCase: RestoreBranchUseCase,
    private readonly getPaginatedBranchUseCase: GetPaginatedBranchUseCase,
    private readonly comboboxBranchUseCase: ComboboxBranchUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.BRANCHES.CREATE)
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiBody({ type: CreateBranchPresentationDto })
  @ApiResponse({ status: 201, description: 'Branch created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateBranchPresentationDto,
    @Req() request: Request,
  ): Promise<Branch> {
    const requestInfo = createRequestInfo(request);
    const command: CreateBranchCommand = {
      desc1: presentationDto.desc1,
      br_code: presentationDto.br_code,
    };
    return this.createBranchUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.BRANCHES.UPDATE)
  @ApiOperation({ summary: 'Update branch information' })
  @ApiParam({ name: 'id', description: 'Branch ID', example: 1 })
  @ApiBody({ type: UpdateBranchPresentationDto })
  @ApiResponse({ status: 200, description: 'Branch updated successfully' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateBranchPresentationDto,
    @Req() request: Request,
  ): Promise<Branch | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateBranchCommand = {
      desc1: presentationDto.desc1,
      br_code: presentationDto.br_code,
    };
    return this.updateBranchUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.BRANCHES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a branch' })
  @ApiParam({ name: 'id', description: 'Branch ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Branch archived successfully' })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveBranchUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.BRANCHES.RESTORE)
  @ApiOperation({ summary: 'Restore a branch' })
  @ApiParam({ name: 'id', description: 'Branch ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Branch restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Branch not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreBranchUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.BRANCHES.READ)
  @ApiOperation({ summary: 'Get paginated list of branches' })
  @ApiResponse({
    status: 200,
    description: 'Branches retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<Branch>> {
    return this.getPaginatedBranchUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.BRANCHES.READ)
  @ApiOperation({ summary: 'Get branches combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Branches combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxBranchUseCase.execute();
  }
}
