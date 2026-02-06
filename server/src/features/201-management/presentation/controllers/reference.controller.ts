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
  CreateReferenceUseCase,
  UpdateReferenceUseCase,
  ArchiveReferenceUseCase,
  RestoreReferenceUseCase,
  GetPaginatedReferenceUseCase,
} from '../../application/use-cases/reference';
import {
  CreateReferenceDto as CreateReferencePresentationDto,
  UpdateReferenceDto as UpdateReferencePresentationDto,
} from '../dto/reference';
import {
  CreateReferenceCommand,
  UpdateReferenceCommand,
} from '../../application/commands/reference';
import { Reference } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import { RATE_LIMIT_MODERATE, RateLimit } from '@/core/infrastructure/decorators';

@ApiTags('Reference')
@Controller('references')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class ReferenceController {
  constructor(
    private readonly createReferenceUseCase: CreateReferenceUseCase,
    private readonly updateReferenceUseCase: UpdateReferenceUseCase,
    private readonly archiveReferenceUseCase: ArchiveReferenceUseCase,
    private readonly restoreReferenceUseCase: RestoreReferenceUseCase,
    private readonly getPaginatedReferenceUseCase: GetPaginatedReferenceUseCase,
  ) { }

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.REFERENCES.CREATE)
  @ApiOperation({ summary: 'Create a new reference' })
  @ApiBody({ type: CreateReferencePresentationDto })
  @ApiResponse({ status: 201, description: 'Reference created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateReferencePresentationDto,
    @Req() request: Request,
  ): Promise<Reference> {
    const requestInfo = createRequestInfo(request);
    const command: CreateReferenceCommand = {
      employee_id: presentationDto.employee_id,
      fname: presentationDto.fname,
      mname: presentationDto.mname,
      lname: presentationDto.lname,
      suffix: presentationDto.suffix,
      cellphone_number: presentationDto.cellphone_number,
    };
    return this.createReferenceUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.REFERENCES.UPDATE)
  @ApiOperation({ summary: 'Update reference information' })
  @ApiParam({ name: 'id', description: 'Reference ID', example: 1 })
  @ApiBody({ type: UpdateReferencePresentationDto })
  @ApiResponse({ status: 200, description: 'Reference updated successfully' })
  @ApiResponse({ status: 404, description: 'Reference not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateReferencePresentationDto,
    @Req() request: Request,
  ): Promise<Reference | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateReferenceCommand = {
      fname: presentationDto.fname,
      mname: presentationDto.mname,
      lname: presentationDto.lname,
      suffix: presentationDto.suffix,
      cellphone_number: presentationDto.cellphone_number,
    };
    return this.updateReferenceUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.REFERENCES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a reference' })
  @ApiParam({ name: 'id', description: 'Reference ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Reference archived successfully' })
  @ApiResponse({ status: 404, description: 'Reference not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveReferenceUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.REFERENCES.RESTORE)
  @ApiOperation({ summary: 'Restore a reference' })
  @ApiParam({ name: 'id', description: 'Reference ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Reference restored successfully',
  })
  @ApiResponse({ status: 404, description: 'Reference not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreReferenceUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.REFERENCES.READ)
  @ApiOperation({ summary: 'Get paginated list of references' })
  @ApiQuery({ name: 'employee_id', required: true, type: Number, description: 'Filter by employee ID' })
  @ApiResponse({
    status: 200,
    description: 'References retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
    @Query('employee_id', ParseIntPipe) employee_id: number,
  ): Promise<PaginatedResult<Reference>> {
    return this.getPaginatedReferenceUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
      employee_id,
    );
  }
}
