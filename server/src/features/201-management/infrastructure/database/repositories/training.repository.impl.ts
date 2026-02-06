import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TrainingRepository } from '@/features/201-management/domain/repositories';
import { Training } from '@/features/201-management/domain/models';
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class TrainingRepositoryImpl implements TrainingRepository<EntityManager> {
  async create(training: Training, manager: EntityManager): Promise<Training> {
    const query = `
      INSERT INTO ${MANAGEMENT_201_DATABASE_MODELS.TRAININGS} (
        employee_id, training_date, trainings_cert_id,
        training_title, desc1, image_path,
        deleted_by, deleted_at,
        created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await manager.query(query, [
      training.employee_id,
      training.training_date,
      training.trainings_cert_id,
      training.training_title,
      training.desc1,
      training.image_path,
      training.deleted_by,
      training.deleted_at,
      training.created_by,
      training.created_at,
      training.updated_by,
      training.updated_at,
    ]);

    const savedEntity = result[0];
    const found = await this.findById(savedEntity.id, manager);
    return found ?? this.entityToModel(savedEntity);
  }

  async update(
    id: number,
    dto: Partial<Training>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.employee_id !== undefined) {
      updateFields.push(`employee_id = $${paramIndex++}`);
      values.push(dto.employee_id);
    }
    if (dto.training_date !== undefined) {
      updateFields.push(`training_date = $${paramIndex++}`);
      values.push(dto.training_date);
    }
    if (dto.trainings_cert_id !== undefined) {
      updateFields.push(`trainings_cert_id = $${paramIndex++}`);
      values.push(dto.trainings_cert_id);
    }
    if (dto.training_title !== undefined) {
      updateFields.push(`training_title = $${paramIndex++}`);
      values.push(dto.training_title);
    }
    if (dto.desc1 !== undefined) {
      updateFields.push(`desc1 = $${paramIndex++}`);
      values.push(dto.desc1);
    }
    if (dto.image_path !== undefined) {
      updateFields.push(`image_path = $${paramIndex++}`);
      values.push(dto.image_path);
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

    // Always update updated_at when any field is updated
    updateFields.push(`updated_at = $${paramIndex++}`);
    values.push(getPHDateTime());

    values.push(id);

    const query = `
      UPDATE ${MANAGEMENT_201_DATABASE_MODELS.TRAININGS}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async findById(id: number, manager: EntityManager): Promise<Training | null> {
    const query = `
      SELECT t.*,
        tc.certificate_name AS trainings_certificate
      FROM ${MANAGEMENT_201_DATABASE_MODELS.TRAININGS} t
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES} tc ON t.trainings_cert_id = tc.id
      WHERE t.id = $1
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
  ): Promise<Training[]> {
    const query = `
      SELECT t.*,
        tc.certificate_name AS trainings_certificate
      FROM ${MANAGEMENT_201_DATABASE_MODELS.TRAININGS} t
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES} tc ON t.trainings_cert_id = tc.id
      WHERE t.employee_id = $1 AND t.deleted_at IS NULL
      ORDER BY t.training_date DESC
    `;

    const result = await manager.query(query, [employee_id]);
    return result.map((row: Record<string, unknown>) => this.entityToModel(row));
  }

  async findByTrainingCertificateId(
    trainings_cert_id: number,
    manager: EntityManager,
  ): Promise<Training[]> {
    const query = `
      SELECT t.*,
        tc.certificate_name AS trainings_certificate
      FROM ${MANAGEMENT_201_DATABASE_MODELS.TRAININGS} t
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES} tc ON t.trainings_cert_id = tc.id
      WHERE t.trainings_cert_id = $1 AND t.deleted_at IS NULL
      ORDER BY t.training_date DESC
    `;

    const result = await manager.query(query, [trainings_cert_id]);
    return result.map((row: Record<string, unknown>) => this.entityToModel(row));
  }

  async findPaginatedList(
    term: string,
    page: number,
    limit: number,
    is_archived: boolean,
    employee_id: number | undefined,
    trainings_cert_id: number | undefined,
    manager: EntityManager,
  ): Promise<PaginatedResult<Training>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';

    // Build WHERE clause
    let whereClause = '';
    const queryParams: unknown[] = [];
    let paramIndex = 1;

    if (is_archived) {
      whereClause = 'WHERE t.deleted_at IS NOT NULL';
    } else {
      whereClause = 'WHERE t.deleted_at IS NULL';
    }

    // Add employee_id filter if provided
    if (employee_id !== undefined) {
      whereClause += ` AND t.employee_id = $${paramIndex}`;
      queryParams.push(employee_id);
      paramIndex++;
    }

    // Add trainings_cert_id filter if provided
    if (trainings_cert_id !== undefined) {
      whereClause += ` AND t.trainings_cert_id = $${paramIndex}`;
      queryParams.push(trainings_cert_id);
      paramIndex++;
    }

    // Add search term if provided (search in training_title, desc1, and certificate_name from join)
    if (term) {
      whereClause += ` AND (t.training_title ILIKE $${paramIndex} OR t.desc1 ILIKE $${paramIndex} OR tc.certificate_name ILIKE $${paramIndex})`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    const joinClause = `LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES} tc ON t.trainings_cert_id = tc.id`;

    // Count total records
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${MANAGEMENT_201_DATABASE_MODELS.TRAININGS} t
      ${joinClause}
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    // Fetch paginated data
    const dataQuery = `
      SELECT t.*,
        tc.certificate_name AS trainings_certificate
      FROM ${MANAGEMENT_201_DATABASE_MODELS.TRAININGS} t
      ${joinClause}
      ${whereClause}
      ORDER BY t.training_date DESC, t.training_title ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const trainings = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: trainings,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  /**
   * Converts database entity to domain model
   */
  private entityToModel(entity: Record<string, unknown>): Training {
    return new Training({
      id: entity.id as number,
      employee_id: entity.employee_id as number | undefined,
      training_date: entity.training_date as Date,
      trainings_cert_id: entity.trainings_cert_id as number,
      trainings_certificate: (entity.trainings_certificate as string) ?? undefined,
      training_title: (entity.training_title as string) ?? undefined,
      desc1: (entity.desc1 as string) ?? undefined,
      image_path: (entity.image_path as string) ?? undefined,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
