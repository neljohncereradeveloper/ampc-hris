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
  CreateTrainingCertificateUseCase,
  UpdateTrainingCertificateUseCase,
  ArchiveTrainingCertificateUseCase,
  RestoreTrainingCertificateUseCase,
  GetPaginatedTrainingCertificateUseCase,
  ComboboxTrainingCertificateUseCase,
} from '../../application/use-cases/training-certificate';
import {
  CreateTrainingCertificateDto as CreateTrainingCertificatePresentationDto,
  UpdateTrainingCertificateDto as UpdateTrainingCertificatePresentationDto,
} from '../dto/training-certificate';
import {
  CreateTrainingCertificateCommand,
  UpdateTrainingCertificateCommand,
} from '../../application/commands/training-certificate';
import { TrainingCertificate } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import { RATE_LIMIT_MODERATE, RateLimit } from '@/core/infrastructure/decorators';

@ApiTags('Training Certificate')
@Controller('training-certificates')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class TrainingCertificateController {
  constructor(
    private readonly createTrainingCertificateUseCase: CreateTrainingCertificateUseCase,
    private readonly updateTrainingCertificateUseCase: UpdateTrainingCertificateUseCase,
    private readonly archiveTrainingCertificateUseCase: ArchiveTrainingCertificateUseCase,
    private readonly restoreTrainingCertificateUseCase: RestoreTrainingCertificateUseCase,
    private readonly getPaginatedTrainingCertificateUseCase: GetPaginatedTrainingCertificateUseCase,
    private readonly comboboxTrainingCertificateUseCase: ComboboxTrainingCertificateUseCase,
  ) { }

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.TRAINING_CERTIFICATES.CREATE)
  @ApiOperation({ summary: 'Create a new training certificate' })
  @ApiBody({ type: CreateTrainingCertificatePresentationDto })
  @ApiResponse({ status: 201, description: 'Training certificate created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateTrainingCertificatePresentationDto,
    @Req() request: Request,
  ): Promise<TrainingCertificate> {
    const requestInfo = createRequestInfo(request);
    const command: CreateTrainingCertificateCommand = {
      certificate_name: presentationDto.certificate_name,
      issuing_organization: presentationDto.issuing_organization,
      issue_date: presentationDto.issue_date,
      expiry_date: presentationDto.expiry_date,
      certificate_number: presentationDto.certificate_number,
      file_path: presentationDto.file_path,
    };
    return this.createTrainingCertificateUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.TRAINING_CERTIFICATES.UPDATE)
  @ApiOperation({ summary: 'Update training certificate information' })
  @ApiParam({ name: 'id', description: 'Training certificate ID', example: 1 })
  @ApiBody({ type: UpdateTrainingCertificatePresentationDto })
  @ApiResponse({ status: 200, description: 'Training certificate updated successfully' })
  @ApiResponse({ status: 404, description: 'Training certificate not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateTrainingCertificatePresentationDto,
    @Req() request: Request,
  ): Promise<TrainingCertificate | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateTrainingCertificateCommand = {
      certificate_name: presentationDto.certificate_name,
      issuing_organization: presentationDto.issuing_organization,
      issue_date: presentationDto.issue_date,
      expiry_date: presentationDto.expiry_date,
      certificate_number: presentationDto.certificate_number,
      file_path: presentationDto.file_path,
    };
    return this.updateTrainingCertificateUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.TRAINING_CERTIFICATES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a training certificate' })
  @ApiParam({ name: 'id', description: 'Training certificate ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Training certificate archived successfully' })
  @ApiResponse({ status: 404, description: 'Training certificate not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveTrainingCertificateUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.TRAINING_CERTIFICATES.RESTORE)
  @ApiOperation({ summary: 'Restore a training certificate' })
  @ApiParam({ name: 'id', description: 'Training certificate ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Training certificate restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Training certificate not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreTrainingCertificateUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.TRAINING_CERTIFICATES.READ)
  @ApiOperation({ summary: 'Get paginated list of training certificates' })
  @ApiResponse({
    status: 200,
    description: 'Training certificates retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<TrainingCertificate>> {
    return this.getPaginatedTrainingCertificateUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.TRAINING_CERTIFICATES.READ)
  @ApiOperation({ summary: 'Get training certificates combobox list' })
  @ApiResponse({
    status: 200,
    description: 'Training certificates combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxTrainingCertificateUseCase.execute();
  }
}
