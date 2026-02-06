import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { EmployeeRepository } from '@/features/shared-domain/domain/repositories';
import { Employee } from '@/features/shared-domain/domain/models';
import { SHARED_DOMAIN_DATABASE_MODELS } from '@/features/shared-domain/domain/constants';
import { MANAGEMENT_201_DATABASE_MODELS } from '@/features/201-management/domain/constants';
import {
  PaginatedResult,
  calculatePagination,
} from '@/core/utils/pagination.util';
import {
  GenderEnum,
  PaymentTypeEnum,
  LaborClassificationEnum,
  LaborClassificationStatusEnum,
} from '@/features/shared-domain/domain/enum';

@Injectable()
export class EmployeeRepositoryImpl
  implements EmployeeRepository<EntityManager> {
  async create(
    employee: Employee,
    manager: EntityManager,
  ): Promise<Employee> {
    const query = `
      INSERT INTO ${SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES} (
        job_title_id, employment_type_id, employment_status_id, leave_type_id,
        branch_id, department_id, hire_date, end_date, regularization_date,
        id_number, bio_number, image_path,
        first_name, middle_name, last_name, suffix, birth_date,
        religion_id, civil_status_id, age, gender, citizen_ship_id,
        height, weight,
        home_address_street, home_address_barangay_id, home_address_city_id,
        home_address_province_id, home_address_zip_code,
        present_address_street, present_address_barangay_id, present_address_city_id,
        present_address_province_id, present_address_zip_code,
        cellphone_number, telephone_number, email,
        emergency_contact_name, emergency_contact_number, emergency_contact_relationship,
        emergency_contact_address,
        husband_or_wife_name, husband_or_wife_birth_date, husband_or_wife_occupation,
        number_of_children,
        fathers_name, fathers_birth_date, fathers_occupation,
        mothers_name, mothers_birth_date, mothers_occupation,
        bank_account_number, bank_account_name, bank_name, bank_branch,
        annual_salary, monthly_salary, daily_rate, hourly_rate, pay_type,
        phic, hdmf, sss_no, tin_no, tax_exempt_code,
        is_active, labor_classification, labor_classification_status,
        remarks, last_entry_date, retention_expiry_date,
        deleted_by, deleted_at, created_by, created_at, updated_by, updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32,
        $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47,
        $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62,
        $63, $64, $65, $66, $67, $68, $69, $70, $71, $72, $73, $74, $75, $76
      )
      RETURNING *
    `;

    const result = await manager.query(query, [
      employee.job_title_id,
      employee.employment_type_id,
      employee.employment_status_id,
      employee.leave_type_id ?? null,
      employee.branch_id,
      employee.department_id,
      employee.hire_date,
      employee.end_date ?? null,
      employee.regularization_date ?? null,
      employee.id_number,
      employee.bio_number ?? null,
      employee.image_path ?? null,
      employee.first_name,
      employee.middle_name ?? null,
      employee.last_name,
      employee.suffix ?? null,
      employee.birth_date,
      employee.religion_id,
      employee.civil_status_id,
      employee.age ?? null,
      employee.gender ?? null,
      employee.citizen_ship_id,
      employee.height ?? null,
      employee.weight ?? null,
      employee.home_address_street,
      employee.home_address_barangay_id,
      employee.home_address_city_id,
      employee.home_address_province_id,
      employee.home_address_zip_code,
      employee.present_address_street ?? null,
      employee.present_address_barangay_id ?? null,
      employee.present_address_city_id ?? null,
      employee.present_address_province_id ?? null,
      employee.present_address_zip_code ?? null,
      employee.cellphone_number ?? null,
      employee.telephone_number ?? null,
      employee.email ?? null,
      employee.emergency_contact_name ?? null,
      employee.emergency_contact_number ?? null,
      employee.emergency_contact_relationship ?? null,
      employee.emergency_contact_address ?? null,
      employee.husband_or_wife_name ?? null,
      employee.husband_or_wife_birth_date ?? null,
      employee.husband_or_wife_occupation ?? null,
      employee.number_of_children ?? null,
      employee.fathers_name ?? null,
      employee.fathers_birth_date ?? null,
      employee.fathers_occupation ?? null,
      employee.mothers_name ?? null,
      employee.mothers_birth_date ?? null,
      employee.mothers_occupation ?? null,
      employee.bank_account_number ?? null,
      employee.bank_account_name ?? null,
      employee.bank_name ?? null,
      employee.bank_branch ?? null,
      employee.annual_salary ?? null,
      employee.monthly_salary ?? null,
      employee.daily_rate ?? null,
      employee.hourly_rate ?? null,
      employee.pay_type ?? null,
      employee.phic ?? null,
      employee.hdmf ?? null,
      employee.sss_no ?? null,
      employee.tin_no ?? null,
      employee.tax_exempt_code ?? null,
      employee.is_active,
      employee.labor_classification ?? null,
      employee.labor_classification_status ?? null,
      employee.remarks ?? null,
      employee.last_entry_date ?? null,
      employee.retention_expiry_date ?? null,
      employee.deleted_by,
      employee.deleted_at,
      employee.created_by,
      employee.created_at,
      employee.updated_by,
      employee.updated_at,
    ]);

    const savedEntity = result[0];
    return this.entityToModel(savedEntity);
  }

  async update(
    id: number,
    dto: Partial<Employee>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    // Employment fields
    if (dto.job_title_id !== undefined) {
      updateFields.push(`job_title_id = $${paramIndex++}`);
      values.push(dto.job_title_id);
    }
    if (dto.employment_type_id !== undefined) {
      updateFields.push(`employment_type_id = $${paramIndex++}`);
      values.push(dto.employment_type_id);
    }
    if (dto.employment_status_id !== undefined) {
      updateFields.push(`employment_status_id = $${paramIndex++}`);
      values.push(dto.employment_status_id);
    }
    if (dto.leave_type_id !== undefined) {
      updateFields.push(`leave_type_id = $${paramIndex++}`);
      values.push(dto.leave_type_id);
    }
    if (dto.branch_id !== undefined) {
      updateFields.push(`branch_id = $${paramIndex++}`);
      values.push(dto.branch_id);
    }
    if (dto.department_id !== undefined) {
      updateFields.push(`department_id = $${paramIndex++}`);
      values.push(dto.department_id);
    }
    if (dto.hire_date !== undefined) {
      updateFields.push(`hire_date = $${paramIndex++}`);
      values.push(dto.hire_date);
    }
    if (dto.end_date !== undefined) {
      updateFields.push(`end_date = $${paramIndex++}`);
      values.push(dto.end_date);
    }
    if (dto.regularization_date !== undefined) {
      updateFields.push(`regularization_date = $${paramIndex++}`);
      values.push(dto.regularization_date);
    }
    if (dto.id_number !== undefined) {
      updateFields.push(`id_number = $${paramIndex++}`);
      values.push(dto.id_number);
    }
    if (dto.bio_number !== undefined) {
      updateFields.push(`bio_number = $${paramIndex++}`);
      values.push(dto.bio_number);
    }
    if (dto.image_path !== undefined) {
      updateFields.push(`image_path = $${paramIndex++}`);
      values.push(dto.image_path);
    }

    // Personal fields
    if (dto.first_name !== undefined) {
      updateFields.push(`first_name = $${paramIndex++}`);
      values.push(dto.first_name);
    }
    if (dto.middle_name !== undefined) {
      updateFields.push(`middle_name = $${paramIndex++}`);
      values.push(dto.middle_name);
    }
    if (dto.last_name !== undefined) {
      updateFields.push(`last_name = $${paramIndex++}`);
      values.push(dto.last_name);
    }
    if (dto.suffix !== undefined) {
      updateFields.push(`suffix = $${paramIndex++}`);
      values.push(dto.suffix);
    }
    if (dto.birth_date !== undefined) {
      updateFields.push(`birth_date = $${paramIndex++}`);
      values.push(dto.birth_date);
    }
    if (dto.religion_id !== undefined) {
      updateFields.push(`religion_id = $${paramIndex++}`);
      values.push(dto.religion_id);
    }
    if (dto.civil_status_id !== undefined) {
      updateFields.push(`civil_status_id = $${paramIndex++}`);
      values.push(dto.civil_status_id);
    }
    if (dto.age !== undefined) {
      updateFields.push(`age = $${paramIndex++}`);
      values.push(dto.age);
    }
    if (dto.gender !== undefined) {
      updateFields.push(`gender = $${paramIndex++}`);
      values.push(dto.gender);
    }
    if (dto.citizen_ship_id !== undefined) {
      updateFields.push(`citizen_ship_id = $${paramIndex++}`);
      values.push(dto.citizen_ship_id);
    }
    if (dto.height !== undefined) {
      updateFields.push(`height = $${paramIndex++}`);
      values.push(dto.height);
    }
    if (dto.weight !== undefined) {
      updateFields.push(`weight = $${paramIndex++}`);
      values.push(dto.weight);
    }

    // Address fields
    if (dto.home_address_street !== undefined) {
      updateFields.push(`home_address_street = $${paramIndex++}`);
      values.push(dto.home_address_street);
    }
    if (dto.home_address_barangay_id !== undefined) {
      updateFields.push(`home_address_barangay_id = $${paramIndex++}`);
      values.push(dto.home_address_barangay_id);
    }
    if (dto.home_address_city_id !== undefined) {
      updateFields.push(`home_address_city_id = $${paramIndex++}`);
      values.push(dto.home_address_city_id);
    }
    if (dto.home_address_province_id !== undefined) {
      updateFields.push(`home_address_province_id = $${paramIndex++}`);
      values.push(dto.home_address_province_id);
    }
    if (dto.home_address_zip_code !== undefined) {
      updateFields.push(`home_address_zip_code = $${paramIndex++}`);
      values.push(dto.home_address_zip_code);
    }
    if (dto.present_address_street !== undefined) {
      updateFields.push(`present_address_street = $${paramIndex++}`);
      values.push(dto.present_address_street);
    }
    if (dto.present_address_barangay_id !== undefined) {
      updateFields.push(`present_address_barangay_id = $${paramIndex++}`);
      values.push(dto.present_address_barangay_id);
    }
    if (dto.present_address_city_id !== undefined) {
      updateFields.push(`present_address_city_id = $${paramIndex++}`);
      values.push(dto.present_address_city_id);
    }
    if (dto.present_address_province_id !== undefined) {
      updateFields.push(`present_address_province_id = $${paramIndex++}`);
      values.push(dto.present_address_province_id);
    }
    if (dto.present_address_zip_code !== undefined) {
      updateFields.push(`present_address_zip_code = $${paramIndex++}`);
      values.push(dto.present_address_zip_code);
    }

    // Contact fields
    if (dto.cellphone_number !== undefined) {
      updateFields.push(`cellphone_number = $${paramIndex++}`);
      values.push(dto.cellphone_number);
    }
    if (dto.telephone_number !== undefined) {
      updateFields.push(`telephone_number = $${paramIndex++}`);
      values.push(dto.telephone_number);
    }
    if (dto.email !== undefined) {
      updateFields.push(`email = $${paramIndex++}`);
      values.push(dto.email);
    }

    // Emergency contact fields
    if (dto.emergency_contact_name !== undefined) {
      updateFields.push(`emergency_contact_name = $${paramIndex++}`);
      values.push(dto.emergency_contact_name);
    }
    if (dto.emergency_contact_number !== undefined) {
      updateFields.push(`emergency_contact_number = $${paramIndex++}`);
      values.push(dto.emergency_contact_number);
    }
    if (dto.emergency_contact_relationship !== undefined) {
      updateFields.push(`emergency_contact_relationship = $${paramIndex++}`);
      values.push(dto.emergency_contact_relationship);
    }
    if (dto.emergency_contact_address !== undefined) {
      updateFields.push(`emergency_contact_address = $${paramIndex++}`);
      values.push(dto.emergency_contact_address);
    }

    // Family fields
    if (dto.husband_or_wife_name !== undefined) {
      updateFields.push(`husband_or_wife_name = $${paramIndex++}`);
      values.push(dto.husband_or_wife_name);
    }
    if (dto.husband_or_wife_birth_date !== undefined) {
      updateFields.push(`husband_or_wife_birth_date = $${paramIndex++}`);
      values.push(dto.husband_or_wife_birth_date);
    }
    if (dto.husband_or_wife_occupation !== undefined) {
      updateFields.push(`husband_or_wife_occupation = $${paramIndex++}`);
      values.push(dto.husband_or_wife_occupation);
    }
    if (dto.number_of_children !== undefined) {
      updateFields.push(`number_of_children = $${paramIndex++}`);
      values.push(dto.number_of_children);
    }
    if (dto.fathers_name !== undefined) {
      updateFields.push(`fathers_name = $${paramIndex++}`);
      values.push(dto.fathers_name);
    }
    if (dto.fathers_birth_date !== undefined) {
      updateFields.push(`fathers_birth_date = $${paramIndex++}`);
      values.push(dto.fathers_birth_date);
    }
    if (dto.fathers_occupation !== undefined) {
      updateFields.push(`fathers_occupation = $${paramIndex++}`);
      values.push(dto.fathers_occupation);
    }
    if (dto.mothers_name !== undefined) {
      updateFields.push(`mothers_name = $${paramIndex++}`);
      values.push(dto.mothers_name);
    }
    if (dto.mothers_birth_date !== undefined) {
      updateFields.push(`mothers_birth_date = $${paramIndex++}`);
      values.push(dto.mothers_birth_date);
    }
    if (dto.mothers_occupation !== undefined) {
      updateFields.push(`mothers_occupation = $${paramIndex++}`);
      values.push(dto.mothers_occupation);
    }

    // Bank fields
    if (dto.bank_account_number !== undefined) {
      updateFields.push(`bank_account_number = $${paramIndex++}`);
      values.push(dto.bank_account_number);
    }
    if (dto.bank_account_name !== undefined) {
      updateFields.push(`bank_account_name = $${paramIndex++}`);
      values.push(dto.bank_account_name);
    }
    if (dto.bank_name !== undefined) {
      updateFields.push(`bank_name = $${paramIndex++}`);
      values.push(dto.bank_name);
    }
    if (dto.bank_branch !== undefined) {
      updateFields.push(`bank_branch = $${paramIndex++}`);
      values.push(dto.bank_branch);
    }

    // Salary fields
    if (dto.annual_salary !== undefined) {
      updateFields.push(`annual_salary = $${paramIndex++}`);
      values.push(dto.annual_salary);
    }
    if (dto.monthly_salary !== undefined) {
      updateFields.push(`monthly_salary = $${paramIndex++}`);
      values.push(dto.monthly_salary);
    }
    if (dto.daily_rate !== undefined) {
      updateFields.push(`daily_rate = $${paramIndex++}`);
      values.push(dto.daily_rate);
    }
    if (dto.hourly_rate !== undefined) {
      updateFields.push(`hourly_rate = $${paramIndex++}`);
      values.push(dto.hourly_rate);
    }
    if (dto.pay_type !== undefined) {
      updateFields.push(`pay_type = $${paramIndex++}`);
      values.push(dto.pay_type);
    }

    // Government fields
    if (dto.phic !== undefined) {
      updateFields.push(`phic = $${paramIndex++}`);
      values.push(dto.phic);
    }
    if (dto.hdmf !== undefined) {
      updateFields.push(`hdmf = $${paramIndex++}`);
      values.push(dto.hdmf);
    }
    if (dto.sss_no !== undefined) {
      updateFields.push(`sss_no = $${paramIndex++}`);
      values.push(dto.sss_no);
    }
    if (dto.tin_no !== undefined) {
      updateFields.push(`tin_no = $${paramIndex++}`);
      values.push(dto.tin_no);
    }
    if (dto.tax_exempt_code !== undefined) {
      updateFields.push(`tax_exempt_code = $${paramIndex++}`);
      values.push(dto.tax_exempt_code);
    }

    // Status fields
    if (dto.is_active !== undefined) {
      updateFields.push(`is_active = $${paramIndex++}`);
      values.push(dto.is_active);
    }
    if (dto.labor_classification !== undefined) {
      updateFields.push(`labor_classification = $${paramIndex++}`);
      values.push(dto.labor_classification);
    }
    if (dto.labor_classification_status !== undefined) {
      updateFields.push(`labor_classification_status = $${paramIndex++}`);
      values.push(dto.labor_classification_status);
    }
    if (dto.remarks !== undefined) {
      updateFields.push(`remarks = $${paramIndex++}`);
      values.push(dto.remarks);
    }
    if (dto.last_entry_date !== undefined) {
      updateFields.push(`last_entry_date = $${paramIndex++}`);
      values.push(dto.last_entry_date);
    }
    if (dto.retention_expiry_date !== undefined) {
      updateFields.push(`retention_expiry_date = $${paramIndex++}`);
      values.push(dto.retention_expiry_date);
    }

    // Audit fields
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
      UPDATE ${SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  /**
   * Builds the SELECT query with all necessary joins for employee data
   */
  private buildEmployeeSelectQuery(): string {
    return `
      SELECT 
        e.*,
        jt.desc1 as job_title,
        et.desc1 as employment_type,
        es.desc1 as employment_status,
        lt.desc1 as leave_type,
        b.desc1 as branch,
        d.desc1 as department,
        r.desc1 as religion,
        cs.desc1 as civil_status,
        c.desc1 as citizen_ship,
        hb.desc1 as home_address_barangay,
        hc.desc1 as home_address_city,
        hp.desc1 as home_address_province,
        pb.desc1 as present_address_barangay,
        pc.desc1 as present_address_city
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES} e
      INNER JOIN ${SHARED_DOMAIN_DATABASE_MODELS.JOBTITLES} jt ON e.job_title_id = jt.id
      INNER JOIN ${MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_TYPES} et ON e.employment_type_id = et.id
      INNER JOIN ${MANAGEMENT_201_DATABASE_MODELS.EMPLOYMENT_STATUSES} es ON e.employment_status_id = es.id
      LEFT JOIN ${SHARED_DOMAIN_DATABASE_MODELS.LEAVE_TYPES} lt ON e.leave_type_id = lt.id
      INNER JOIN ${SHARED_DOMAIN_DATABASE_MODELS.BRANCHES} b ON e.branch_id = b.id
      INNER JOIN ${SHARED_DOMAIN_DATABASE_MODELS.DEPARTMENTS} d ON e.department_id = d.id
      INNER JOIN ${MANAGEMENT_201_DATABASE_MODELS.RELIGIONS} r ON e.religion_id = r.id
      INNER JOIN ${MANAGEMENT_201_DATABASE_MODELS.CIVIL_STATUSES} cs ON e.civil_status_id = cs.id
      INNER JOIN ${MANAGEMENT_201_DATABASE_MODELS.CITIZENSHIPS} c ON e.citizen_ship_id = c.id
      INNER JOIN ${MANAGEMENT_201_DATABASE_MODELS.BARANGAYS} hb ON e.home_address_barangay_id = hb.id
      INNER JOIN ${MANAGEMENT_201_DATABASE_MODELS.CITIES} hc ON e.home_address_city_id = hc.id
      INNER JOIN ${MANAGEMENT_201_DATABASE_MODELS.PROVINCES} hp ON e.home_address_province_id = hp.id
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.BARANGAYS} pb ON e.present_address_barangay_id = pb.id
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.CITIES} pc ON e.present_address_city_id = pc.id
      LEFT JOIN ${MANAGEMENT_201_DATABASE_MODELS.PROVINCES} pp ON e.present_address_province_id = pp.id
    `;
  }

  async findById(
    id: number,
    manager: EntityManager,
  ): Promise<Employee | null> {
    const query = `
      ${this.buildEmployeeSelectQuery()}
      WHERE e.id = $1
    `;

    const result = await manager.query(query, [id]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findByIdNumber(
    id_number: string,
    manager: EntityManager,
  ): Promise<Employee | null> {
    const query = `
      ${this.buildEmployeeSelectQuery()}
      WHERE e.id_number = $1 AND e.deleted_at IS NULL
    `;

    const result = await manager.query(query, [id_number]);
    if (result.length === 0) {
      return null;
    }

    return this.entityToModel(result[0]);
  }

  async findByBioNumber(
    bio_number: string,
    manager: EntityManager,
  ): Promise<Employee | null> {
    const query = `
      ${this.buildEmployeeSelectQuery()}
      WHERE e.bio_number = $1 AND e.deleted_at IS NULL
    `;

    const result = await manager.query(query, [bio_number]);
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
  ): Promise<PaginatedResult<Employee>> {
    const offset = (page - 1) * limit;
    const searchTerm = term ? `%${term}%` : '%';

    let whereClause = '';
    const queryParams: unknown[] = [];
    let paramIndex = 1;

    if (is_archived) {
      whereClause = 'WHERE e.deleted_at IS NOT NULL';
    } else {
      whereClause = 'WHERE e.deleted_at IS NULL';
    }

    if (term) {
      whereClause += ` AND (
        e.id_number ILIKE $${paramIndex} OR
        e.bio_number ILIKE $${paramIndex} OR
        e.first_name ILIKE $${paramIndex} OR
        e.middle_name ILIKE $${paramIndex} OR
        e.last_name ILIKE $${paramIndex} OR
        e.email ILIKE $${paramIndex}
      )`;
      queryParams.push(searchTerm);
      paramIndex++;
    }

    const countQuery = `
      SELECT COUNT(DISTINCT e.id) as total
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES} e
      ${whereClause}
    `;

    const countResult = await manager.query(countQuery, queryParams);
    const totalRecords = parseInt(countResult[0].total, 10);

    const dataQuery = `
      ${this.buildEmployeeSelectQuery()}
      ${whereClause}
      ORDER BY e.last_name ASC, e.first_name ASC, e.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const dataResult = await manager.query(dataQuery, queryParams);

    const employees = dataResult.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );

    return {
      data: employees,
      meta: calculatePagination(totalRecords, page, limit),
    };
  }

  async updateImagePath(
    employee_id: number,
    image_path: string,
    manager: EntityManager,
  ): Promise<boolean> {
    const query = `
      UPDATE ${SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES}
      SET image_path = $1
      WHERE id = $2 AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, [image_path, employee_id]);
    return result.length > 0;
  }

  async updateGovernmentDetails(
    employee_id: number,
    government_details: Partial<Employee>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (government_details.phic !== undefined) {
      updateFields.push(`phic = $${paramIndex++}`);
      values.push(government_details.phic);
    }
    if (government_details.hdmf !== undefined) {
      updateFields.push(`hdmf = $${paramIndex++}`);
      values.push(government_details.hdmf);
    }
    if (government_details.sss_no !== undefined) {
      updateFields.push(`sss_no = $${paramIndex++}`);
      values.push(government_details.sss_no);
    }
    if (government_details.tin_no !== undefined) {
      updateFields.push(`tin_no = $${paramIndex++}`);
      values.push(government_details.tin_no);
    }
    if (government_details.tax_exempt_code !== undefined) {
      updateFields.push(`tax_exempt_code = $${paramIndex++}`);
      values.push(government_details.tax_exempt_code);
    }
    if (government_details.updated_by !== undefined) {
      updateFields.push(`updated_by = $${paramIndex++}`);
      values.push(government_details.updated_by);
    }

    if (updateFields.length === 0) {
      return false;
    }

    values.push(employee_id);

    const query = `
      UPDATE ${SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async updateSalaryDetails(
    employee_id: number,
    salary_details: Partial<Employee>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (salary_details.annual_salary !== undefined) {
      updateFields.push(`annual_salary = $${paramIndex++}`);
      values.push(salary_details.annual_salary);
    }
    if (salary_details.monthly_salary !== undefined) {
      updateFields.push(`monthly_salary = $${paramIndex++}`);
      values.push(salary_details.monthly_salary);
    }
    if (salary_details.daily_rate !== undefined) {
      updateFields.push(`daily_rate = $${paramIndex++}`);
      values.push(salary_details.daily_rate);
    }
    if (salary_details.hourly_rate !== undefined) {
      updateFields.push(`hourly_rate = $${paramIndex++}`);
      values.push(salary_details.hourly_rate);
    }
    if (salary_details.pay_type !== undefined) {
      updateFields.push(`pay_type = $${paramIndex++}`);
      values.push(salary_details.pay_type);
    }
    if (salary_details.updated_by !== undefined) {
      updateFields.push(`updated_by = $${paramIndex++}`);
      values.push(salary_details.updated_by);
    }

    if (updateFields.length === 0) {
      return false;
    }

    values.push(employee_id);

    const query = `
      UPDATE ${SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async updateBankDetails(
    employee_id: number,
    bank_details: Partial<Employee>,
    manager: EntityManager,
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (bank_details.bank_account_number !== undefined) {
      updateFields.push(`bank_account_number = $${paramIndex++}`);
      values.push(bank_details.bank_account_number);
    }
    if (bank_details.bank_account_name !== undefined) {
      updateFields.push(`bank_account_name = $${paramIndex++}`);
      values.push(bank_details.bank_account_name);
    }
    if (bank_details.bank_name !== undefined) {
      updateFields.push(`bank_name = $${paramIndex++}`);
      values.push(bank_details.bank_name);
    }
    if (bank_details.bank_branch !== undefined) {
      updateFields.push(`bank_branch = $${paramIndex++}`);
      values.push(bank_details.bank_branch);
    }
    if (bank_details.updated_by !== undefined) {
      updateFields.push(`updated_by = $${paramIndex++}`);
      values.push(bank_details.updated_by);
    }

    if (updateFields.length === 0) {
      return false;
    }

    values.push(employee_id);

    const query = `
      UPDATE ${SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES}
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex} AND deleted_at IS NULL
      RETURNING id
    `;

    const result = await manager.query(query, values);
    return result.length > 0;
  }

  async retrieveActiveEmployees(
    manager: EntityManager,
  ): Promise<Employee[]> {
    const query = `
      SELECT *
      FROM ${SHARED_DOMAIN_DATABASE_MODELS.EMPLOYEES}
      WHERE is_active = true AND deleted_at IS NULL
      ORDER BY last_name ASC, first_name ASC
    `;

    const result = await manager.query(query);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  async findEmployeesEligibleForLeave(
    employment_type_names: string[],
    employment_status_names: string[],
    manager: EntityManager,
  ): Promise<Employee[]> {
    if (
      employment_type_names.length === 0 ||
      employment_status_names.length === 0
    ) {
      return [];
    }

    const query = `
      ${this.buildEmployeeSelectQuery()}
      WHERE e.is_active = true
        AND e.deleted_at IS NULL
        AND et.desc1 = ANY($1)
        AND es.desc1 = ANY($2)
      ORDER BY e.last_name ASC, e.first_name ASC
    `;

    const result = await manager.query(query, [
      employment_type_names,
      employment_status_names,
    ]);
    return result.map((row: Record<string, unknown>) =>
      this.entityToModel(row),
    );
  }

  private entityToModel(entity: Record<string, unknown>): Employee {
    return new Employee({
      id: entity.id as number,
      job_title_id: entity.job_title_id as number,
      job_title: (entity.job_title as string) ?? undefined,
      employment_type_id: entity.employment_type_id as number,
      employment_type: (entity.employment_type as string) ?? undefined,
      employment_status_id: entity.employment_status_id as number,
      employment_status: (entity.employment_status as string) ?? undefined,
      leave_type_id: (entity.leave_type_id as number) ?? undefined,
      leave_type: (entity.leave_type as string) ?? undefined,
      branch_id: entity.branch_id as number,
      branch: (entity.branch as string) ?? undefined,
      department_id: entity.department_id as number,
      department: (entity.department as string) ?? undefined,
      hire_date: entity.hire_date as Date,
      end_date: (entity.end_date as Date) ?? undefined,
      regularization_date: (entity.regularization_date as Date) ?? undefined,
      id_number: entity.id_number as string,
      bio_number: (entity.bio_number as string) ?? undefined,
      image_path: (entity.image_path as string) ?? undefined,
      first_name: entity.first_name as string,
      middle_name: (entity.middle_name as string) ?? undefined,
      last_name: entity.last_name as string,
      suffix: (entity.suffix as string) ?? undefined,
      birth_date: entity.birth_date as Date,
      religion_id: entity.religion_id as number,
      civil_status_id: entity.civil_status_id as number,
      age: (entity.age as number) ?? undefined,
      gender: (entity.gender as GenderEnum) ?? undefined,
      citizen_ship_id: entity.citizen_ship_id as number,
      height: (entity.height as number) ?? undefined,
      weight: (entity.weight as number) ?? undefined,
      home_address_street: entity.home_address_street as string,
      home_address_barangay_id: entity.home_address_barangay_id as number,
      home_address_barangay: (entity.home_address_barangay as string) ?? undefined,
      home_address_city_id: entity.home_address_city_id as number,
      home_address_city: (entity.home_address_city as string) ?? undefined,
      home_address_province_id: entity.home_address_province_id as number,
      home_address_province: (entity.home_address_province as string) ?? undefined,
      home_address_zip_code: entity.home_address_zip_code as string,
      present_address_street: (entity.present_address_street as string) ?? undefined,
      present_address_barangay_id: (entity.present_address_barangay_id as number) ?? undefined,
      present_address_barangay: (entity.present_address_barangay as string) ?? undefined,
      present_address_city_id: (entity.present_address_city_id as number) ?? undefined,
      present_address_city: (entity.present_address_city as string) ?? undefined,
      present_address_province_id: (entity.present_address_province_id as number) ?? undefined,
      present_address_zip_code: (entity.present_address_zip_code as string) ?? undefined,
      cellphone_number: (entity.cellphone_number as string) ?? undefined,
      telephone_number: (entity.telephone_number as string) ?? undefined,
      email: (entity.email as string) ?? undefined,
      emergency_contact_name: (entity.emergency_contact_name as string) ?? undefined,
      emergency_contact_number: (entity.emergency_contact_number as string) ?? undefined,
      emergency_contact_relationship: (entity.emergency_contact_relationship as string) ?? undefined,
      emergency_contact_address: (entity.emergency_contact_address as string) ?? undefined,
      husband_or_wife_name: (entity.husband_or_wife_name as string) ?? undefined,
      husband_or_wife_birth_date: (entity.husband_or_wife_birth_date as Date) ?? undefined,
      husband_or_wife_occupation: (entity.husband_or_wife_occupation as string) ?? undefined,
      number_of_children: (entity.number_of_children as number) ?? undefined,
      fathers_name: (entity.fathers_name as string) ?? undefined,
      fathers_birth_date: (entity.fathers_birth_date as Date) ?? undefined,
      fathers_occupation: (entity.fathers_occupation as string) ?? undefined,
      mothers_name: (entity.mothers_name as string) ?? undefined,
      mothers_birth_date: (entity.mothers_birth_date as Date) ?? undefined,
      mothers_occupation: (entity.mothers_occupation as string) ?? undefined,
      bank_account_number: (entity.bank_account_number as string) ?? undefined,
      bank_account_name: (entity.bank_account_name as string) ?? undefined,
      bank_name: (entity.bank_name as string) ?? undefined,
      bank_branch: (entity.bank_branch as string) ?? undefined,
      annual_salary: (entity.annual_salary as number) ?? undefined,
      monthly_salary: (entity.monthly_salary as number) ?? undefined,
      daily_rate: (entity.daily_rate as number) ?? undefined,
      hourly_rate: (entity.hourly_rate as number) ?? undefined,
      pay_type: (entity.pay_type as PaymentTypeEnum) ?? undefined,
      phic: (entity.phic as string) ?? undefined,
      hdmf: (entity.hdmf as string) ?? undefined,
      sss_no: (entity.sss_no as string) ?? undefined,
      tin_no: (entity.tin_no as string) ?? undefined,
      tax_exempt_code: (entity.tax_exempt_code as string) ?? undefined,
      is_active: entity.is_active as boolean,
      labor_classification: (entity.labor_classification as LaborClassificationEnum) ?? undefined,
      labor_classification_status: (entity.labor_classification_status as LaborClassificationStatusEnum) ?? undefined,
      remarks: (entity.remarks as string) ?? undefined,
      last_entry_date: (entity.last_entry_date as Date) ?? undefined,
      retention_expiry_date: (entity.retention_expiry_date as Date) ?? undefined,
      deleted_by: (entity.deleted_by as string) ?? null,
      deleted_at: (entity.deleted_at as Date) ?? null,
      created_by: (entity.created_by as string) ?? null,
      created_at: entity.created_at as Date,
      updated_by: (entity.updated_by as string) ?? null,
      updated_at: entity.updated_at as Date,
    });
  }
}
