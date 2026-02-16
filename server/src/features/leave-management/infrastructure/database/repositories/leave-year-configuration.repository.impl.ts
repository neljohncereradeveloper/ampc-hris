import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { LeaveYearConfigurationRepository } from '@/features/leave-management/domain/repositories/leave-year-configuration.repository';
import { LeaveYearConfiguration } from '@/features/leave-management/domain/models/leave-year-configuration.model';
import { LEAVE_MANAGEMENT_DATABASE_MODELS } from '@/features/leave-management/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';

@Injectable()
export class LeaveYearConfigurationRepositoryImpl implements LeaveYearConfigurationRepository<EntityManager> {
  async create(
    leave_year_configuration: LeaveYearConfiguration,
    manager: EntityManager,
  ): Promise<LeaveYearConfiguration> {
    const query = `
      INSERT INTO ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS} (
        cutoff_start_date, cutoff_end_date, year, remarks,
        deleted_by, deleted_at, created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const result = await manager.query(query, [
      leave_year_configuration.cutoff_start_date,
      leave_year_configuration.cutoff_end_date,
      leave_year_configuration.year,
      leave_year_configuration.remarks ?? null,
      leave_year_configuration.deleted_by ?? null,
      leave_year_configuration.deleted_at ?? null,
      leave_year_configuration.created_by ?? null,
      leave_year_configuration.created_at ?? new Date(),
      leave_year_configuration.updated_by ?? null,
      leave_year_configuration.updated_at ?? new Date(),
    ]);
    return this.entityToModel(result[0]);
  }

  async update(
    id: number,
    dto: Partial<LeaveYearConfiguration>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;
    if (dto.cutoff_start_date !== undefined) {
      updateFields.push(`cutoff_start_date = $${paramIndex++}`);
      values.push(dto.cutoff_start_date);
    }
    if (dto.cutoff_end_date !== undefined) {
      updateFields.push(`cutoff_end_date = $${paramIndex++}`);
      values.push(dto.cutoff_end_date);
    }
    if (dto.year !== undefined) {
      updateFields.push(`year = $${paramIndex++}`);
      values.push(dto.year);
    }
    if (dto.remarks !== undefined) {
      updateFields.push(`remarks = $${paramIndex++}`);
      values.push(dto.remarks);
    }
    if (dto.updated_by !== undefined) {
      updateFields.push(`updated_by = $${paramIndex++}`);
      values.push(dto.updated_by);
    }
    if (updateFields.length === 0) return false;

    values.push(id);
    const query = `
      UPDATE ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;
    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async findById(
    id: number,
    manager: EntityManager,
  ): Promise<LeaveYearConfiguration | null> {
    const query = `SELECT * FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS} WHERE id = $1`;
    const result = await manager.query(query, [id]);
    if (result.length === 0) return null;
    return this.entityToModel(result[0]);
  }

  async findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    manager: EntityManager,
  ): Promise<PaginatedResult<LeaveYearConfiguration>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';

    let whereClause = is_archived
      ? 'WHERE deleted_at IS NOT NULL'
      : 'WHERE deleted_at IS NULL';
    const queryParams: unknown[] = [];
    let paramIndex = 1;
    if (term) {
      whereClause += ` AND (year ILIKE $${paramIndex} OR remarks ILIKE $${paramIndex})`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS}
      ${whereClause}
    `;
    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    queryParams.push(limit, offset);
    const dataQuery = `
      SELECT * FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS}
      ${whereClause}
      ORDER BY year DESC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const dataResult = await manager.query(dataQuery, queryParams);
    const data = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
    return { data, meta: calculatePagination(totalRecords, page, limit) };
  }

  async findByYear(
    year: string,
    manager: EntityManager,
  ): Promise<LeaveYearConfiguration | null> {
    const query = `
      SELECT * FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS}
      WHERE year = $1 AND deleted_at IS NULL
    `;
    const result = await manager.query(query, [year]);
    if (result.length === 0) return null;
    return this.entityToModel(result[0]);
  }

  async findActiveForDate(
    date: Date,
    manager: EntityManager,
  ): Promise<LeaveYearConfiguration | null> {
    const query = `
      SELECT * FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS}
      WHERE $1::date >= cutoff_start_date AND $1::date <= cutoff_end_date AND deleted_at IS NULL
    `;
    const result = await manager.query(query, [date]);
    if (result.length === 0) return null;
    return this.entityToModel(result[0]);
  }

  async findAll(manager: EntityManager): Promise<LeaveYearConfiguration[]> {
    const query = `
      SELECT * FROM ${LEAVE_MANAGEMENT_DATABASE_MODELS.LEAVE_YEAR_CONFIGURATIONS}
      WHERE deleted_at IS NULL ORDER BY year DESC
    `;
    const result = await manager.query(query);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  private entityToModel(
    entity: Record<string, unknown>,
  ): LeaveYearConfiguration {
    return new LeaveYearConfiguration({
      id: entity.id as number,
      cutoff_start_date: entity.cutoff_start_date as Date,
      cutoff_end_date: entity.cutoff_end_date as Date,
      year: entity.year as string,
      remarks: (entity.remarks as string) ?? undefined,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
