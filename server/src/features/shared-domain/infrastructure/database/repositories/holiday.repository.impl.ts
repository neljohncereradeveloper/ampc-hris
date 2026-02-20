import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { HolidayRepository } from '@/features/shared-domain/domain/repositories';
import { Holiday } from '@/features/shared-domain/domain/models';
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';

@Injectable()
export class HolidayRepositoryImpl implements HolidayRepository<EntityManager> {
  async create(holiday: Holiday, manager: EntityManager): Promise<Holiday> {
    const query = `
      INSERT INTO ${SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS} (
        name, date, type, description, is_recurring, created_by
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await manager.query(query, [
      holiday.name,
      holiday.date,
      holiday.type,
      holiday.description,
      holiday.is_recurring,
      holiday.created_by,
    ]);

    return this.entityToModel(result[0]);
  }

  async update(
    id: number,
    dto: Partial<Holiday>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.name !== undefined) {
      updateFields.push(`name = $${paramIndex++}`);
      values.push(dto.name);
    }
    if (dto.date !== undefined) {
      updateFields.push(`date = $${paramIndex++}`);
      values.push(dto.date);
    }
    if (dto.type !== undefined) {
      updateFields.push(`type = $${paramIndex++}`);
      values.push(dto.type);
    }
    if (dto.description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      values.push(dto.description);
    }
    if (dto.is_recurring !== undefined) {
      updateFields.push(`is_recurring = $${paramIndex++}`);
      values.push(dto.is_recurring);
    }
    if (dto.deleted_by !== undefined) {
      updateFields.push(`deleted_by = $${paramIndex++}`);
      values.push(dto.deleted_by);
    }
    if (dto.deleted_at !== undefined) {
      updateFields.push(`deleted_at = $${paramIndex++}`);
      values.push(dto.deleted_at);
    }
    if (dto.updated_by !== undefined) {
      updateFields.push(`updated_by = $${paramIndex++}`);
      values.push(dto.updated_by);
    }

    if (updateFields.length === 0) {
      return false;
    }

    values.push(id);

    const query = `
      UPDATE ${SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  /**
   * Finds a holiday by ID regardless of archived status.
   * Used internally for archive/restore operations where we need
   * to fetch the record before performing state transitions.
   */
  async findById(id: number, manager: EntityManager): Promise<Holiday | null> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS}
      WHERE id = $1
    `;

    const result = await manager.query(query, [id]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findByName(
    name: string,
    manager: EntityManager,
  ): Promise<Holiday | null> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS}
      WHERE name = $1 AND deleted_at IS NULL
    `;

    const result = await manager.query(query, [name]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    manager: EntityManager,
  ): Promise<PaginatedResult<Holiday>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';

    const queryParams: unknown[] = [];
    let paramIndex = 1;

    let whereClause = is_archived
      ? 'WHERE deleted_at IS NOT NULL'
      : 'WHERE deleted_at IS NULL';

    if (term) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR type ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS}
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    const dataQuery = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS}
      ${whereClause}
      ORDER BY date ASC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const holidays = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: holidays,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  /**
   * Returns all holidays within a date range.
   */
  async findByDateRange(
    start_date: Date,
    end_date: Date,
    manager: EntityManager,
  ): Promise<Holiday[]> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS}
      WHERE date >= $1 AND date <= $2 AND deleted_at IS NULL
      ORDER BY date ASC
    `;

    const result = await manager.query(query, [start_date, end_date]);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  /**
   * Returns a lightweight list of active holidays for use in dropdowns.
   * Selects all fields to ensure `fromPersistence()` maps correctly.
   */
  async combobox(manager: EntityManager): Promise<Holiday[]> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.HOLIDAYS}
      WHERE deleted_at IS NULL
      ORDER BY date ASC, name ASC
    `;

    const result = await manager.query(query);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  private entityToModel(entity: Record<string, unknown>): Holiday {
    return Holiday.fromPersistence(entity);
  }
}
