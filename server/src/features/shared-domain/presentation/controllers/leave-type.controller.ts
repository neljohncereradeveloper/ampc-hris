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
  CreateLeaveTypeUseCase,
  UpdateLeaveTypeUseCase,
  ArchiveLeaveTypeUseCase,
  RestoreLeaveTypeUseCase,
  GetPaginatedLeaveTypeUseCase,
  ComboboxLeaveTypeUseCase,
} from '../../application/use-cases/leave-type';
import {
  CreateLeaveTypeDto as CreateLeaveTypePresentationDto,
  UpdateLeaveTypeDto as UpdateLeaveTypePresentationDto,
} from '../dto/leave-type';
import {
  CreateLeaveTypeCommand,
  UpdateLeaveTypeCommand,
} from '../../application/commands/leave-type';
import { LeaveType } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import { RATE_LIMIT_MODERATE, RateLimit } from '@/core/infrastructure/decorators';

@ApiTags('Leave Type')
@Controller('leave-types')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class LeaveTypeController {
  constructor(
    private readonly createLeaveTypeUseCase: CreateLeaveTypeUseCase,
    private readonly updateLeaveTypeUseCase: UpdateLeaveTypeUseCase,
    private readonly archiveLeaveTypeUseCase: ArchiveLeaveTypeUseCase,
    private readonly restoreLeaveTypeUseCase: RestoreLeaveTypeUseCase,
    private readonly getPaginatedLeaveTypeUseCase: GetPaginatedLeaveTypeUseCase,
    private readonly comboboxLeaveTypeUseCase: ComboboxLeaveTypeUseCase,
  ) { }

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.LEAVE_TYPES.CREATE)
  @ApiOperation({ summary: 'Create a new leave type' })
  @ApiBody({ type: CreateLeaveTypePresentationDto })
  @ApiResponse({ status: 201, description: 'Leave type created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateLeaveTypePresentationDto,
    @Req() request: Request,
  ): Promise<LeaveType> {
    const requestInfo = createRequestInfo(request);
    const command: CreateLeaveTypeCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createLeaveTypeUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.LEAVE_TYPES.UPDATE)
  @ApiOperation({ summary: 'Update leave type information' })
  @ApiParam({ name: 'id', description: 'Leave type ID', example: 1 })
  @ApiBody({ type: UpdateLeaveTypePresentationDto })
  @ApiResponse({ status: 200, description: 'Leave type updated successfully' })
  @ApiResponse({ status: 404, description: 'Leave type not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateLeaveTypePresentationDto,
    @Req() request: Request,
  ): Promise<LeaveType | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateLeaveTypeCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateLeaveTypeUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.LEAVE_TYPES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a leave type' })
  @ApiParam({ name: 'id', description: 'Leave type ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Leave type archived successfully' })
  @ApiResponse({ status: 404, description: 'Leave type not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveLeaveTypeUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.LEAVE_TYPES.RESTORE)
  @ApiOperation({ summary: 'Restore a leave type' })
  @ApiParam({ name: 'id', description: 'Leave type ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Leave type restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Leave type not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreLeaveTypeUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.LEAVE_TYPES.READ)
  @ApiOperation({ summary: 'Get paginated list of leave types' })
  @ApiResponse({
    status: 200,
    description: 'Leave types retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<LeaveType>> {
    return this.getPaginatedLeaveTypeUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.LEAVE_TYPES.READ)
  @ApiOperation({ summary: 'Get leave types combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Leave types combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxLeaveTypeUseCase.execute();
  }
}
