import {
  Controller,
  Get,
  Post,
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
import { LeaveRequest } from '../../domain/models';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';
import {
  CreateLeaveRequestUseCase,
  ApproveLeaveRequestUseCase,
  CancelLeaveRequestUseCase,
  GetPaginatedLeaveRequestByEmployeeUseCase,
  GetPaginatedPendingLeaveRequestsUseCase,
  GetPaginatedLeaveRequestUseCase,
  RejectLeaveRequestUseCase,
  UpdateLeaveRequestUseCase,
} from '../../application/use-cases/leave-request';
import {
  CreateLeaveRequestDto,
  ApproveLeaveRequestDto,
  CancelLeaveRequestDto,
  RejectLeaveRequestDto,
  UpdateLeaveRequestDto,
  GetPaginatedLeaveRequestByEmployeeDto,
  GetPaginatedPendingLeaveRequestsDto,
} from '../dto/leave-request';
import {
  ApproveLeaveRequestCommand,
  CancelLeaveRequestCommand,
  RejectLeaveRequestCommand,
  UpdateLeaveRequestCommand,
  CreateLeaveRequestCommand,
} from '../../application/commands/leave-request';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';

@ApiTags('Leave Request')
@Controller('leave-requests')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class LeaveRequestController {
  constructor(
    private readonly createLeaveRequestUseCase: CreateLeaveRequestUseCase,
    private readonly approveLeaveRequestUseCase: ApproveLeaveRequestUseCase,
    private readonly cancelLeaveRequestUseCase: CancelLeaveRequestUseCase,
    private readonly getPaginatedLeaveRequestByEmployeeUseCase: GetPaginatedLeaveRequestByEmployeeUseCase,
    private readonly getPaginatedPendingLeaveRequestsUseCase: GetPaginatedPendingLeaveRequestsUseCase,
    private readonly getPaginatedLeaveRequestUseCase: GetPaginatedLeaveRequestUseCase,
    private readonly rejectLeaveRequestUseCase: RejectLeaveRequestUseCase,
    private readonly updateLeaveRequestUseCase: UpdateLeaveRequestUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.LEAVE_REQUESTS.CREATE)
  @ApiOperation({ summary: 'Create a new leave request' })
  @ApiBody({ type: CreateLeaveRequestDto })
  @ApiResponse({
    status: 201,
    description: 'Leave request created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateLeaveRequestDto,
    @Req() request: Request,
  ): Promise<LeaveRequest> {
    const requestInfo = createRequestInfo(request);
    const command: CreateLeaveRequestCommand = {
      employee_id: presentationDto.employee_id,
      leave_type_code: presentationDto.leave_type_code,
      start_date: presentationDto.start_date,
      end_date: presentationDto.end_date,
      is_half_day: presentationDto.is_half_day,
      reason: presentationDto.reason,
      remarks: presentationDto.remarks,
    };
    return this.createLeaveRequestUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.LEAVE_REQUESTS.UPDATE)
  @ApiOperation({ summary: 'Update a leave request' })
  @ApiParam({ name: 'id', description: 'Leave request ID', example: 1 })
  @ApiBody({ type: UpdateLeaveRequestDto })
  @ApiResponse({
    status: 200,
    description: 'Leave request updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateLeaveRequestDto,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateLeaveRequestCommand = {
      start_date: presentationDto.start_date,
      end_date: presentationDto.end_date,
      is_half_day: presentationDto.is_half_day,
      reason: presentationDto.reason,
      remarks: presentationDto.remarks,
    };
    await this.updateLeaveRequestUseCase.execute(id, command, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.LEAVE_REQUESTS.APPROVE)
  @ApiOperation({ summary: 'Approve a leave request' })
  @ApiParam({ name: 'id', description: 'Leave request ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Leave request approved successfully',
  })
  @ApiResponse({ status: 404, description: 'Leave request not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: ApproveLeaveRequestDto,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    const command: ApproveLeaveRequestCommand = {
      remarks: presentationDto.remarks,
    };
    await this.approveLeaveRequestUseCase.execute(id, command, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.LEAVE_REQUESTS.CANCEL)
  @ApiOperation({ summary: 'Cancel a leave request' })
  @ApiParam({ name: 'id', description: 'Leave request ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Leave request cancelled successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async cancel(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: CancelLeaveRequestDto,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    const command: CancelLeaveRequestCommand = {
      remarks: presentationDto.remarks,
    };
    await this.cancelLeaveRequestUseCase.execute(id, command, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.LEAVE_REQUESTS.REJECT)
  @ApiOperation({ summary: 'Reject a leave request' })
  @ApiParam({ name: 'id', description: 'Leave request ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Leave request rejected successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async reject(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: RejectLeaveRequestDto,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    const command: RejectLeaveRequestCommand = {
      remarks: presentationDto.remarks,
    };
    await this.rejectLeaveRequestUseCase.execute(id, command, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get('by-employee')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.LEAVE_REQUESTS.READ)
  @ApiOperation({ summary: 'Get paginated leave requests by employee' })
  @ApiBody({ type: GetPaginatedLeaveRequestByEmployeeDto })
  @ApiResponse({
    status: 200,
    description: 'Leave requests loaded successfully',
  })
  @ApiResponse({ status: 404, description: 'Leave request not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginatedLeaveRequestsByEmployee(
    @Query() queryDto: GetPaginatedLeaveRequestByEmployeeDto,
  ): Promise<PaginatedResult<LeaveRequest>> {
    const employee_id = Number(queryDto.employee_id);
    const term = queryDto.term ?? '';
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;
    const is_archived = queryDto.is_archived === 'true';
    return this.getPaginatedLeaveRequestByEmployeeUseCase.execute(
      employee_id,
      term ?? '',
      page,
      limit,
      is_archived,
    );
  }

  @Version('1')
  @Get('pending')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.LEAVE_REQUESTS.READ)
  @ApiOperation({ summary: 'Get paginated pending leave requests' })
  @ApiBody({ type: GetPaginatedPendingLeaveRequestsDto })
  @ApiResponse({
    status: 200,
    description: 'Pending leave requests loaded successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginatedPendingLeaveRequests(
    @Query() queryDto: GetPaginatedPendingLeaveRequestsDto,
  ): Promise<PaginatedResult<LeaveRequest>> {
    const term = queryDto.term ?? '';
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;
    return this.getPaginatedPendingLeaveRequestsUseCase.execute(
      term,
      page,
      limit,
    );
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.LEAVE_REQUESTS.READ)
  @ApiOperation({ summary: 'Get paginated leave requests' })
  @ApiBody({ type: PaginationQueryDto })
  @ApiResponse({
    status: 200,
    description: 'Leave requests loaded successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginatedLeaveRequests(
    @Query() queryDto: PaginationQueryDto,
  ): Promise<PaginatedResult<LeaveRequest>> {
    const term = queryDto.term ?? '';
    const page = Number(queryDto.page) || 1;
    const limit = Number(queryDto.limit) || 10;
    const is_archived = queryDto.is_archived === 'true';
    return this.getPaginatedLeaveRequestUseCase.execute(
      term,
      page,
      limit,
      is_archived,
    );
  }
}
