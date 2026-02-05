import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EmploymentTypeRepository } from '@/features/201-management/domain/repositories';
import { EmploymentType } from '@/features/201-management/domain/models';
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';

@Injectable()
export class EmploymentTypeRepositoryImpl
  implements EmploymentTypeRepository<EntityManager> {
  async create(
    employment_type: EmploymentType,
    manager: EntityManager,
  ): Promise<EmploymentType> {
    const query = `
      INSERT INTO ${MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_TYPES} (
        desc1, deleted_by, deleted_at,
        created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await manager.query(query, [
      employment_type.desc1,
      employment_type.deleted_by,
      employment_type.deleted_at,
      employment_type.created_by,
      employment_type.created_at,
      employment_type.updated_by,
      employment_type.updated_at,
    ]);

    const savedEntity = result[0];
    return this.entityToModel(savedEntity);
  }

  async update(
    id: number,
    dto: Partial<EmploymentType>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.desc1 !== undefined) {
      updateFields.push(`desc1 = $${paramIndex++}`);
      values.push(dto.desc1);
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
      UPDATE ${MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_TYPES}
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
  ): Promise<EmploymentType | null> {
    const query = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_TYPES}
      WHERE id = $1
    `;

    const result = await manager.query(query, [id]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findByDescription(
    description: string,
    manager: EntityManager,
  ): Promise<EmploymentType | null> {
    const query = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_TYPES}
      WHERE desc1 = $1 AND deleted_at IS NULL
    `;

    const result = await manager.query(query, [description]);
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
  ): Promise<PaginatedResult<EmploymentType>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';

    let whereClause = '';
    const queryParams: unknown[] = [];
    let paramIndex = 1;

    if (is_archived) {
      whereClause = 'WHERE deleted_at IS NOT NULL';
    } else {
      whereClause = 'WHERE deleted_at IS NULL';
    }

    if (term) {
      whereClause += ` AND desc1 ILIKE $${paramIndex}`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_TYPES}
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    const dataQuery = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_TYPES}
      ${whereClause}
      ORDER BY desc1 ASC, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const employment_types = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: employment_types,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  async combobox(manager: EntityManager): Promise<EmploymentType[]> {
    const query = `
      SELECT id, desc1
      FROM ${MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_TYPES}
      WHERE deleted_at IS NULL
      ORDER BY desc1 ASC
    `;

    const result = await manager.query(query);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  private entityToModel(entity: Record<string, unknown>): EmploymentType {
    return new EmploymentType({
      id: entity.id as number,
      desc1: entity.desc1 as string,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
