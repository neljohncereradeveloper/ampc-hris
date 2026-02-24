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
  CreateTestThreeUseCase,
  UpdateTestThreeUseCase,
  ArchiveTestThreeUseCase,
  RestoreTestThreeUseCase,
  GetPaginatedTestThreeUseCase,
  ComboboxTestThreeUseCase,
} from '../../application/use-cases/test-three';
import {
  CreateTestThreeDto as CreateTestThreePresentationDto,
  UpdateTestThreeDto as UpdateTestThreePresentationDto,
} from '../dto/test-three';
import {
  CreateTestThreeCommand,
  UpdateTestThreeCommand,
} from '../../application/commands/test-three';
import { TestThree } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('TestThree')
@Controller('test-threes')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class TestThreeController {
  constructor(
    private readonly createTestThreeUseCase: CreateTestThreeUseCase,
    private readonly updateTestThreeUseCase: UpdateTestThreeUseCase,
    private readonly archiveTestThreeUseCase: ArchiveTestThreeUseCase,
    private readonly restoreTestThreeUseCase: RestoreTestThreeUseCase,
    private readonly getPaginatedTestThreeUseCase: GetPaginatedTestThreeUseCase,
    private readonly comboboxTestThreeUseCase: ComboboxTestThreeUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.TEST_THREES.CREATE)
  @ApiOperation({ summary: 'Create a new TestThree' })
  @ApiBody({ type: CreateTestThreePresentationDto })
  @ApiResponse({ status: 201, description: 'TestThree created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateTestThreePresentationDto,
    @Req() request: Request,
  ): Promise<TestThree> {
    const requestInfo = createRequestInfo(request);
    const command: CreateTestThreeCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createTestThreeUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.TEST_THREES.UPDATE)
  @ApiOperation({ summary: 'Update TestThree information' })
  @ApiParam({ name: 'id', description: 'TestThree ID', example: 1 })
  @ApiBody({ type: UpdateTestThreePresentationDto })
  @ApiResponse({ status: 200, description: 'TestThree updated successfully' })
  @ApiResponse({ status: 404, description: 'TestThree not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateTestThreePresentationDto,
    @Req() request: Request,
  ): Promise<TestThree | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateTestThreeCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateTestThreeUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.TEST_THREES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a TestThree' })
  @ApiParam({ name: 'id', description: 'TestThree ID', example: 1 })
  @ApiResponse({ status: 200, description: 'TestThree archived successfully' })
  @ApiResponse({ status: 404, description: 'TestThree not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveTestThreeUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.TEST_THREES.RESTORE)
  @ApiOperation({ summary: 'Restore a TestThree' })
  @ApiParam({ name: 'id', description: 'TestThree ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'TestThree restored successfully',
  })
  @ApiResponse({ status: 404, description: 'TestThree not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreTestThreeUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.TEST_THREES.READ)
  @ApiOperation({ summary: 'Get paginated list of TestThrees' })
  @ApiResponse({
    status: 200,
    description: 'TestThrees retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<TestThree>> {
    return this.getPaginatedTestThreeUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.TEST_THREES.READ)
  @ApiOperation({ summary: 'Get TestThreess combobox list' })
  @ApiResponse({
    status: 200,
    description: 'TestThrees combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxTestThreeUseCase.execute();
  }
}
