import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TrainingCertificateRepository } from '@/features/201-management/domain/repositories';
import { TrainingCertificate } from '@/features/201-management/domain/models';
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';
import { getPHDateTime } from '@/core/utils/date.util';

@Injectable()
export class TrainingCertificateRepositoryImpl implements TrainingCertificateRepository<EntityManager> {
  async create(certificate: TrainingCertificate, manager: EntityManager): Promise<TrainingCertificate> {
    const query = `
      INSERT INTO ${MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES} (
        certificate_name, issuing_organization, issue_date,
        expiry_date, certificate_number, file_path,
        deleted_by, deleted_at,
        created_by, created_at, updated_by, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const result = await manager.query(query, [
      certificate.certificate_name,
      certificate.issuing_organization,
      certificate.issue_date,
      certificate.expiry_date,
      certificate.certificate_number,
      certificate.file_path,
      certificate.deleted_by,
      certificate.deleted_at,
      certificate.created_by,
      certificate.created_at,
      certificate.updated_by,
      certificate.updated_at,
    ]);

    const savedEntity = result[0];
    return this.entityToModel(savedEntity);
  }

  async update(
    id: number,
    dto: Partial<TrainingCertificate>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (dto.certificate_name !== undefined) {
      updateFields.push(`certificate_name = $${paramIndex++}`);
      values.push(dto.certificate_name);
    }
    if (dto.issuing_organization !== undefined) {
      updateFields.push(`issuing_organization = $${paramIndex++}`);
      values.push(dto.issuing_organization);
    }
    if (dto.issue_date !== undefined) {
      updateFields.push(`issue_date = $${paramIndex++}`);
      values.push(dto.issue_date);
    }
    if (dto.expiry_date !== undefined) {
      updateFields.push(`expiry_date = $${paramIndex++}`);
      values.push(dto.expiry_date);
    }
    if (dto.certificate_number !== undefined) {
      updateFields.push(`certificate_number = $${paramIndex++}`);
      values.push(dto.certificate_number);
    }
    if (dto.file_path !== undefined) {
      updateFields.push(`file_path = $${paramIndex++}`);
      values.push(dto.file_path);
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
      UPDATE ${MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async findById(id: number, manager: EntityManager): Promise<TrainingCertificate | null> {
    const query = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES}
      WHERE id = $1
    `;

    const result = await manager.query(query, [id]);
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
  ): Promise<PaginatedResult<TrainingCertificate>> {
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

    // Add search term if provided
    if (term) {
      whereClause += ` AND (certificate_name ILIKE $${paramIndex} OR issuing_organization ILIKE $${paramIndex} OR certificate_number ILIKE $${paramIndex})`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    // Count total records
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES}
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    // Fetch paginated data
    const dataQuery = `
      SELECT *
      FROM ${MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES}
      ${whereClause}
      ORDER BY certificate_name ASC, issue_date DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const certificates = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: certificates,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  async combobox(manager: EntityManager): Promise<TrainingCertificate[]> {
    const query = `
      SELECT id, certificate_name, issuing_organization
      FROM ${MANAGEMENT_201_DATABASE_MODELS.TRAINING_CERTIFICATES}
      WHERE deleted_at IS NULL
      ORDER BY certificate_name ASC
    `;

    const result = await manager.query(query);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  /**
   * Converts database entity to domain model
   */
  private entityToModel(entity: Record<string, unknown>): TrainingCertificate {
    return new TrainingCertificate({
      id: entity.id as number,
      certificate_name: entity.certificate_name as string,
      issuing_organization: entity.issuing_organization as string,
      issue_date: entity.issue_date as Date,
      expiry_date: (entity.expiry_date as Date) ?? null,
      certificate_number: (entity.certificate_number as string) ?? null,
      file_path: (entity.file_path as string) ?? null,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
