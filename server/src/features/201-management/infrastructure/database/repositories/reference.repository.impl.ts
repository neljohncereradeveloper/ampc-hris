import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ReferenceRepository } from '@/features/201-management/domain/repositories';
import { Reference } from '@/features/201-management/domain/models';
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';

@Injectable()
export class ReferenceRepositoryImpl implements ReferenceRepository<EntityManager> {
  async create(reference: Reference, manager: EntityManager): Promise<Reference> {
    const query = `
      INSERT INTO ${MANAGEMENT_201_DATABASE_MODELS.REFERENCES} (
        employee_id, fname, mname, lname, suffix, cellphone_number,
        deleted_by, deleted_at,
        created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await manager.query(query, [
      reference.employee_id,
      reference.fname,
      reference.mname,
      reference.lname,
      reference.suffix,
      reference.cellphone_number,
      reference.deleted_by,
      reference.deleted_at,
      reference.created_by,
      reference.created_at,
      reference.updated_by,
      reference.updated_at,
    ]);

    const savedEntity = result[0];
    return this.entityToModel(savedEntity);
  }

  async update(
    id: number,
    dto: Partial<Reference>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.employee_id !== undefined) {
      updateFields.push(`employee_id = $${paramIndex++}`);
      values.push(dto.employee_id);
    }
    if (dto.fname !== undefined) {
      updateFields.push(`fname = $${paramIndex++}`);
      values.push(dto.fname);
    }
    if (dto.mname !== undefined) {
      updateFields.push(`mname = $${paramIndex++}`);
      values.push(dto.mname);
    }
    if (dto.lname !== undefined) {
      updateFields.push(`lname = $${paramIndex++}`);
      values.push(dto.lname);
    }
    if (dto.suffix !== undefined) {
      updateFields.push(`suffix = $${paramIndex++}`);
      values.push(dto.suffix);
    }
    if (dto.cellphone_number !== undefined) {
      updateFields.push(`cellphone_number = $${paramIndex++}`);
      values.push(dto.cellphone_number);
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
      UPDATE ${MANAGEMENT_201_DATABASE_MODELS.REFERENCES}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async findById(id: number, manager: EntityManager): Promise<Reference | null> {
    const query = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.REFERENCES}
      WHERE id = $1
    `;

    const result = await manager.query(query, [id]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findByEmployeeId(
    employee_id: number,
    manager: EntityManager,
  ): Promise<Reference[]> {
    const query = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.REFERENCES}
      WHERE employee_id = $1 AND deleted_at IS NULL
      ORDER BY created_at DESC
    `;

    const result = await manager.query(query, [employee_id]);
    return result.map((row: Record<string, unknown>) => this.entityToModel(row));
  }

  async findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    employee_id: number | undefined,
    manager: EntityManager,
  ): Promise<PaginatedResult<Reference>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';

    // Build WHERE clause
    let whereClause = '';
    const queryParams: unknown[] = [];
    let paramIndex = 1;

    if (is_archived) {
      whereClause = 'WHERE deleted_at IS NOT NULL';
    } else {
      whereClause = 'WHERE deleted_at IS NULL';
    }

    // Add employee_id filter if provided
    if (employee_id !== undefined) {
      whereClause += ` AND employee_id = $${paramIndex}`;
      queryParams.push(employee_id);
      paramIndex++;
    }

    // Add search term if provided
    if (term) {
      whereClause += ` AND (fname ILIKE $${paramIndex} OR mname ILIKE $${paramIndex} OR lname ILIKE $${paramIndex} OR cellphone_number ILIKE $${paramIndex})`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    // Count total records
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${MANAGEMENT_201_DATABASE_MODELS.REFERENCES}
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    // Fetch paginated data
    const dataQuery = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.REFERENCES}
      ${whereClause}
      ORDER BY lname ASC, fname ASC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const references = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: references,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  /**
   * Converts database entity to domain model
   */
  private entityToModel(entity: Record<string, unknown>): Reference {
    return new Reference({
      id: entity.id as number,
      employee_id: entity.employee_id as number | undefined,
      fname: entity.fname as string,
      mname: entity.mname as string | undefined,
      lname: entity.lname as string,
      suffix: entity.suffix as string | undefined,
      cellphone_number: entity.cellphone_number as string | undefined,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
