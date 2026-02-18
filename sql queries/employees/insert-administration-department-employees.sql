-- SQL Queries to Insert Administration Department Employees
-- Department: Administration (id: 6)
-- Employment Status: active (id: 1)
-- Employment Type: regular (id: 1)

-- Employee 1: General Manager
INSERT INTO employees (
    job_title_id,
    employment_type_id,
    employment_status_id,
    branch_id,
    department_id,
    hire_date,
    regularization_date,
    id_number,
    bio_number,
    first_name,
    last_name,
    middle_name,
    birth_date,
    religion_id,
    civil_status_id,
    age,
    gender,
    citizenship_id,
    home_address_street,
    home_address_city_id,
    home_address_province_id,
    home_address_zip_code,
    email,
    cellphone_number,
    annual_salary,
    monthly_salary,
    daily_rate,
    hourly_rate,
    sss_no,
    tin_no,
    phic,
    hdmf,
    emergency_contact_name,
    emergency_contact_number,
    emergency_contact_relationship,
    emergency_contact_address,
    husband_or_wife_name,
    husband_or_wife_birth_date,
    husband_or_wife_occupation,
    fathers_name,
    fathers_birth_date,
    fathers_occupation,
    mothers_name,
    mothers_birth_date,
    mothers_occupation
) VALUES (
    5,  -- general manager
    1,  -- regular
    1,  -- active
    1,  -- default branch
    6,  -- administration
    '2010-05-01',  -- 14 years service
    '2010-08-01',  -- regularized after 3 months
    'EMP-ADMIN-2010-001',
    'BIO-ADMIN-2010-001',
    'Roberto',
    'Fernandez',
    'Santos',
    '1975-12-15',  -- birth date (age 49)
    1,  -- roman catholic
    2,  -- married
    49,  -- age
    'male',
    1,  -- filipino
    '123 Executive Plaza',
    2,  -- davao city
    1,  -- metro manila
    '8000',
    'roberto.fernandez@company.com',
    '09171234567',
    2400000.00,  -- annual salary
    200000.00,   -- monthly salary
    7692.31,     -- daily rate
    961.54,      -- hourly rate
    '34-1234567-8',
    '123-456-789-000',
    '12-345678901-2',
    '123456789012',
    'Maria Fernandez',
    '09204567891',
    'spouse',
    '123 Executive Plaza, Davao City, 8000',
    'Maria Fernandez',
    '1977-03-22',
    'Corporate Lawyer',
    'Carlos Fernandez',
    '1945-08-10',
    'Retired CEO',
    'Carmen Santos',
    '1948-11-25',
    'Retired School Principal'
);

-- Employee 2: Secretary
INSERT INTO employees (
    job_title_id,
    employment_type_id,
    employment_status_id,
    branch_id,
    department_id,
    hire_date,
    regularization_date,
    id_number,
    bio_number,
    first_name,
    last_name,
    middle_name,
    birth_date,
    religion_id,
    civil_status_id,
    age,
    gender,
    citizenship_id,
    home_address_street,
    home_address_city_id,
    home_address_province_id,
    home_address_zip_code,
    email,
    cellphone_number,
    annual_salary,
    monthly_salary,
    daily_rate,
    hourly_rate,
    sss_no,
    tin_no,
    phic,
    hdmf,
    emergency_contact_name,
    emergency_contact_number,
    emergency_contact_relationship,
    emergency_contact_address,
    fathers_name,
    fathers_birth_date,
    fathers_occupation,
    mothers_name,
    mothers_birth_date,
    mothers_occupation
) VALUES (
    7,  -- supervisor (used as secretary role)
    1,  -- regular
    1,  -- active
    1,  -- default branch
    6,  -- administration
    '2021-09-01',  -- 3 years service
    '2021-12-01',  -- regularized after 3 months
    'EMP-ADMIN-2021-001',
    'BIO-ADMIN-2021-001',
    'Jennifer',
    'Lopez',
    'Ramos',
    '1993-06-20',  -- birth date (age 31)
    1,  -- roman catholic
    1,  -- single
    31,  -- age
    'female',
    1,  -- filipino
    '456 Administrative Center Street',
    3,  -- valencia city
    2,  -- ilocos norte
    '8709',
    'jennifer.lopez@company.com',
    '09182345678',
    840000.00,  -- annual salary
    70000.00,   -- monthly salary
    2692.31,    -- daily rate
    336.54,     -- hourly rate
    '34-2345678-9',
    '234-567-890-000',
    '23-456789012-3',
    '234567890123',
    'Ricardo Lopez',
    '09215678902',
    'father',
    '456 Administrative Center Street, Valencia City, 8709',
    'Ricardo Lopez',
    '1968-04-15',
    'Government Employee',
    'Maria Ramos',
    '1970-09-30',
    'Secretary'
);

-- Employee 3: Secretary
INSERT INTO employees (
    job_title_id,
    employment_type_id,
    employment_status_id,
    branch_id,
    department_id,
    hire_date,
    regularization_date,
    id_number,
    bio_number,
    first_name,
    last_name,
    middle_name,
    birth_date,
    religion_id,
    civil_status_id,
    age,
    gender,
    citizenship_id,
    home_address_street,
    home_address_city_id,
    home_address_province_id,
    home_address_zip_code,
    email,
    cellphone_number,
    annual_salary,
    monthly_salary,
    daily_rate,
    hourly_rate,
    sss_no,
    tin_no,
    phic,
    hdmf,
    emergency_contact_name,
    emergency_contact_number,
    emergency_contact_relationship,
    emergency_contact_address,
    fathers_name,
    fathers_birth_date,
    fathers_occupation,
    mothers_name,
    mothers_birth_date,
    mothers_occupation
) VALUES (
    7,  -- supervisor (used as secretary role)
    1,  -- regular
    1,  -- active
    1,  -- default branch
    6,  -- administration
    '2022-11-15',  -- 2 years service
    '2023-02-15',  -- regularized after 3 months
    'EMP-ADMIN-2022-001',
    'BIO-ADMIN-2022-001',
    'Christine',
    'Garcia',
    'Torres',
    '1995-10-08',  -- birth date (age 29)
    1,  -- roman catholic
    1,  -- single
    29,  -- age
    'female',
    1,  -- filipino
    '789 Office Support Lane',
    4,  -- tagum city
    3,  -- ilocos sur
    '8100',
    'christine.garcia@company.com',
    '09193456789',
    780000.00,  -- annual salary
    65000.00,   -- monthly salary
    2500.00,    -- daily rate
    312.50,     -- hourly rate
    '34-3456789-0',
    '345-678-901-000',
    '34-567890123-4',
    '345678901234',
    'Eduardo Garcia',
    '09226789013',
    'father',
    '789 Office Support Lane, Tagum City, 8100',
    'Eduardo Garcia',
    '1967-01-18',
    'Accountant',
    'Rosa Torres',
    '1969-07-05',
    'Teacher'
);

-- Verify the inserted Administration Department employees
SELECT 
    id,
    id_number,
    first_name,
    last_name,
    (SELECT desc1 FROM job_titles WHERE id = job_title_id) as job_title,
    (SELECT desc1 FROM employment_types WHERE id = employment_type_id) as employment_type,
    (SELECT desc1 FROM employment_statuses WHERE id = employment_status_id) as employment_status,
    hire_date,
    regularization_date,
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date)) as years_of_service,
    age,
    (SELECT desc1 FROM civil_statuses WHERE id = civil_status_id) as civil_status
FROM employees
WHERE department_id = 6
  AND deleted_at IS NULL
ORDER BY hire_date ASC;

