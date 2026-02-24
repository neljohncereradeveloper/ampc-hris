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
  CreateTestOneUseCase,
  UpdateTestOneUseCase,
  ArchiveTestOneUseCase,
  RestoreTestOneUseCase,
  GetPaginatedTestOneUseCase,
  ComboboxTestOneUseCase,
} from '../../application/use-cases/test-one';
import {
  CreateTestOneDto as CreateTestOnePresentationDto,
  UpdateTestOneDto as UpdateTestOnePresentationDto,
} from '../dto/test-one';
import {
  CreateTestOneCommand,
  UpdateTestOneCommand,
} from '../../application/commands/test-one';
import { TestOne } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('TestOne')
@Controller('test-ones')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class TestOneController {
  constructor(
    private readonly createTestOneUseCase: CreateTestOneUseCase,
    private readonly updateTestOneUseCase: UpdateTestOneUseCase,
    private readonly archiveTestOneUseCase: ArchiveTestOneUseCase,
    private readonly restoreTestOneUseCase: RestoreTestOneUseCase,
    private readonly getPaginatedTestOneUseCase: GetPaginatedTestOneUseCase,
    private readonly comboboxTestOneUseCase: ComboboxTestOneUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.TEST_ONES.CREATE)
  @ApiOperation({ summary: 'Create a new TestOne' })
  @ApiBody({ type: CreateTestOnePresentationDto })
  @ApiResponse({ status: 201, description: 'TestOne created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateTestOnePresentationDto,
    @Req() request: Request,
  ): Promise<TestOne> {
    const requestInfo = createRequestInfo(request);
    const command: CreateTestOneCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createTestOneUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.TEST_ONES.UPDATE)
  @ApiOperation({ summary: 'Update TestOne information' })
  @ApiParam({ name: 'id', description: 'TestOne ID', example: 1 })
  @ApiBody({ type: UpdateTestOnePresentationDto })
  @ApiResponse({ status: 200, description: 'TestOne updated successfully' })
  @ApiResponse({ status: 404, description: 'TestOne not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateTestOnePresentationDto,
    @Req() request: Request,
  ): Promise<TestOne | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateTestOneCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateTestOneUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.TEST_ONES.ARCHIVE)
  @ApiOperation({ summary: 'Archive a TestOne' })
  @ApiParam({ name: 'id', description: 'TestOne ID', example: 1 })
  @ApiResponse({ status: 200, description: 'TestOne archived successfully' })
  @ApiResponse({ status: 404, description: 'TestOne not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveTestOneUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.TEST_ONES.RESTORE)
  @ApiOperation({ summary: 'Restore a TestOne' })
  @ApiParam({ name: 'id', description: 'TestOne ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'TestOne restored successfully',
  })
  @ApiResponse({ status: 404, description: 'TestOne not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreTestOneUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.TEST_ONES.READ)
  @ApiOperation({ summary: 'Get paginated list of TestOnes' })
  @ApiResponse({
    status: 200,
    description: 'TestOnes retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<TestOne>> {
    return this.getPaginatedTestOneUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.TEST_ONES.READ)
  @ApiOperation({ summary: 'Get TestOness combobox list' })
  @ApiResponse({
    status: 200,
    description: 'TestOnes combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxTestOneUseCase.execute();
  }
}
