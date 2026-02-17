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
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';
import { createRequestInfo } from '@/core/utils/request-info.util';
import {
  RequirePermissions,
  RequireRoles,
} from '@/features/auth/infrastructure/decorators';
import { PERMISSIONS, ROLES } from '@/core/domain/constants';
import {
  CreateTrainingUseCase,
  UpdateTrainingUseCase,
  ArchiveTrainingUseCase,
  RestoreTrainingUseCase,
  GetPaginatedTrainingUseCase,
} from '../../application/use-cases/training';
import {
  CreateTrainingDto as CreateTrainingPresentationDto,
  UpdateTrainingDto as UpdateTrainingPresentationDto,
} from '../dto/training';
import {
  CreateTrainingCommand,
  UpdateTrainingCommand,
} from '../../application/commands/training';
import { Training } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';
import { PaginationTrainingQueryDto } from '../dto/training/pagination-training-query.dto';

@ApiTags('Training')
@Controller('trainings')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class TrainingController {
  constructor(
    private readonly createTrainingUseCase: CreateTrainingUseCase,
    private readonly updateTrainingUseCase: UpdateTrainingUseCase,
    private readonly archiveTrainingUseCase: ArchiveTrainingUseCase,
    private readonly restoreTrainingUseCase: RestoreTrainingUseCase,
    private readonly getPaginatedTrainingUseCase: GetPaginatedTrainingUseCase,
  ) { }

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.TRAININGS.CREATE)
  @ApiOperation({ summary: 'Create a new training' })
  @ApiBody({ type: CreateTrainingPresentationDto })
  @ApiResponse({ status: 201, description: 'Training created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateTrainingPresentationDto,
    @Req() request: Request,
  ): Promise<Training> {
    const requestInfo = createRequestInfo(request);
    const command: CreateTrainingCommand = {
      employee_id: presentationDto.employee_id,
      training_date: presentationDto.training_date,
      trainings_cert_id: presentationDto.trainings_cert_id,
      training_title: presentationDto.training_title,
      desc1: presentationDto.desc1,
      image_path: presentationDto.image_path,
    };
    return this.createTrainingUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.TRAININGS.UPDATE)
  @ApiOperation({ summary: 'Update training information' })
  @ApiParam({ name: 'id', description: 'Training ID', example: 1 })
  @ApiBody({ type: UpdateTrainingPresentationDto })
  @ApiResponse({ status: 200, description: 'Training updated successfully' })
  @ApiResponse({ status: 404, description: 'Training not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateTrainingPresentationDto,
    @Req() request: Request,
  ): Promise<Training | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateTrainingCommand = {
      training_date: presentationDto.training_date,
      trainings_cert_id: presentationDto.trainings_cert_id,
      training_title: presentationDto.training_title,
      desc1: presentationDto.desc1,
      image_path: presentationDto.image_path,
    };
    return this.updateTrainingUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.TRAININGS.ARCHIVE)
  @ApiOperation({ summary: 'Archive a training' })
  @ApiParam({ name: 'id', description: 'Training ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Training archived successfully' })
  @ApiResponse({ status: 404, description: 'Training not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveTrainingUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.TRAININGS.RESTORE)
  @ApiOperation({ summary: 'Restore a training' })
  @ApiParam({ name: 'id', description: 'Training ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Training restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Training not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreTrainingUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.TRAININGS.READ)
  @ApiOperation({ summary: 'Get paginated list of trainings' })
  @ApiQuery({
    name: 'employee_id',
    required: true,
    type: Number,
    description: 'Filter by employee ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Trainings retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationTrainingQueryDto,
  ): Promise<PaginatedResult<Training>> {
    return this.getPaginatedTrainingUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
      query.employee_id!,
    );
  }
}
