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
  CreateTestTwoUseCase,
  UpdateTestTwoUseCase,
  ArchiveTestTwoUseCase,
  RestoreTestTwoUseCase,
  GetPaginatedTestTwoUseCase,
  ComboboxTestTwoUseCase,
} from '../../application/use-cases/test-two';
import {
  CreateTestTwoDto as CreateTestTwoPresentationDto,
  UpdateTestTwoDto as UpdateTestTwoPresentationDto,
} from '../dto/test-two';
import {
  CreateTestTwoCommand,
  UpdateTestTwoCommand,
} from '../../application/commands/test-two';
import { TestTwo } from '../../domain/models';
import { PaginatedResult } from '@/core/utils/pagination.util';
import { PaginationQueryDto } from '@/core/infrastructure/dto';
import {
  RATE_LIMIT_MODERATE,
  RateLimit,
} from '@/core/infrastructure/decorators';

@ApiTags('TestTwo')
@Controller('test-twos')
@RateLimit({
  ...RATE_LIMIT_MODERATE,
  message: 'Too many requests. Please try again later.',
})
export class TestTwoController {
  constructor(
    private readonly createTestTwoUseCase: CreateTestTwoUseCase,
    private readonly updateTestTwoUseCase: UpdateTestTwoUseCase,
    private readonly archiveTestTwoUseCase: ArchiveTestTwoUseCase,
    private readonly restoreTestTwoUseCase: RestoreTestTwoUseCase,
    private readonly getPaginatedTestTwoUseCase: GetPaginatedTestTwoUseCase,
    private readonly comboboxTestTwoUseCase: ComboboxTestTwoUseCase,
  ) {}

  @Version('1')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.TEST_TWOS.CREATE)
  @ApiOperation({ summary: 'Create a new TestTwo' })
  @ApiBody({ type: CreateTestTwoPresentationDto })
  @ApiResponse({ status: 201, description: 'TestTwo created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async create(
    @Body() presentationDto: CreateTestTwoPresentationDto,
    @Req() request: Request,
  ): Promise<TestTwo> {
    const requestInfo = createRequestInfo(request);
    const command: CreateTestTwoCommand = {
      desc1: presentationDto.desc1,
    };
    return this.createTestTwoUseCase.execute(command, requestInfo);
  }

  @Version('1')
  @Put(':id')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR)
  @RequirePermissions(PERMISSIONS.TEST_TWOS.UPDATE)
  @ApiOperation({ summary: 'Update TestTwo information' })
  @ApiParam({ name: 'id', description: 'TestTwo ID', example: 1 })
  @ApiBody({ type: UpdateTestTwoPresentationDto })
  @ApiResponse({ status: 200, description: 'TestTwo updated successfully' })
  @ApiResponse({ status: 404, description: 'TestTwo not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() presentationDto: UpdateTestTwoPresentationDto,
    @Req() request: Request,
  ): Promise<TestTwo | null> {
    const requestInfo = createRequestInfo(request);
    const command: UpdateTestTwoCommand = {
      desc1: presentationDto.desc1,
    };
    return this.updateTestTwoUseCase.execute(id, command, requestInfo);
  }

  @Version('1')
  @Delete(':id/archive')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.TEST_TWOS.ARCHIVE)
  @ApiOperation({ summary: 'Archive a TestTwo' })
  @ApiParam({ name: 'id', description: 'TestTwo ID', example: 1 })
  @ApiResponse({ status: 200, description: 'TestTwo archived successfully' })
  @ApiResponse({ status: 404, description: 'TestTwo not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async archive(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.archiveTestTwoUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @RequireRoles(ROLES.ADMIN)
  @RequirePermissions(PERMISSIONS.TEST_TWOS.RESTORE)
  @ApiOperation({ summary: 'Restore a TestTwo' })
  @ApiParam({ name: 'id', description: 'TestTwo ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'TestTwo restored successfully',
  })
  @ApiResponse({ status: 404, description: 'TestTwo not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async restore(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request,
  ): Promise<{ success: boolean }> {
    const requestInfo = createRequestInfo(request);
    await this.restoreTestTwoUseCase.execute(id, requestInfo);
    return { success: true };
  }

  @Version('1')
  @Get()
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.TEST_TWOS.READ)
  @ApiOperation({ summary: 'Get paginated list of TestTwos' })
  @ApiResponse({
    status: 200,
    description: 'TestTwos retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getPaginated(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResult<TestTwo>> {
    return this.getPaginatedTestTwoUseCase.execute(
      query.term ?? '',
      query.page,
      query.limit,
      query.is_archived === 'true',
    );
  }

  @Version('1')
  @Get('combobox')
  @RequireRoles(ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER)
  @RequirePermissions(PERMISSIONS.TEST_TWOS.READ)
  @ApiOperation({ summary: 'Get TestTwoss combobox list' })
  @ApiResponse({
    status: 200,
    description: 'TestTwos combobox retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  async getCombobox(): Promise<{ value: string; label: string }[]> {
    return this.comboboxTestTwoUseCase.execute();
  }
}
