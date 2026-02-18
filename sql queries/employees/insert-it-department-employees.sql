-- SQL Queries to Insert IT Department Employees
-- Department: Information Technology (id: 2)
-- Employment Status: active (id: 1)
-- Employment Types: regular (id: 1), probationary (id: 2)

-- Employee 1: Department Head - 12 years service, age 40+
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
    1,  -- department head
    1,  -- regular
    1,  -- active
    1,  -- default branch
    2,  -- information technology
    '2012-01-15',  -- 12 years service
    '2012-04-15',  -- regularized after 3 months
    'EMP-IT-2012-001',
    'BIO-IT-2012-001',
    'Ricardo',
    'Mendoza',
    'Villanueva',
    '1982-03-20',  -- birth date
    1,  -- roman catholic
    2,  -- married
    42,  -- age
    'male',
    1,  -- filipino
    '789 Tech Park Avenue',
    2,  -- davao city
    1,  -- metro manila
    '8000',
    'ricardo.mendoza@company.com',
    '09171234567',
    1800000.00,  -- annual salary
    150000.00,   -- monthly salary
    5769.23,     -- daily rate
    721.15,      -- hourly rate
    '34-1234567-8',
    '123-456-789-000',
    '12-345678901-2',
    '123456789012',
    'Catherine Mendoza',
    '09204567891',
    'spouse',
    '789 Tech Park Avenue, Davao City, 8000',
    'Catherine Mendoza',
    '1984-06-15',
    'Project Manager',
    'Roberto Mendoza',
    '1955-08-10',
    'Retired IT Manager',
    'Carmen Villanueva',
    '1958-11-25',
    'Retired Teacher'
);

-- Employee 2: Supervisor - 5 years service, age 30+
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
    7,  -- supervisor
    1,  -- regular
    1,  -- active
    1,  -- default branch
    2,  -- information technology
    '2019-06-01',  -- 5 years service
    '2019-09-01',  -- regularized after 3 months
    'EMP-IT-2019-001',
    'BIO-IT-2019-001',
    'Daniel',
    'Cruz',
    'Ramos',
    '1989-09-12',  -- birth date
    1,  -- roman catholic
    1,  -- single
    35,  -- age
    'male',
    1,  -- filipino
    '456 Innovation Drive',
    3,  -- valencia city
    2,  -- ilocos norte
    '8709',
    'daniel.cruz@company.com',
    '09182345678',
    1200000.00,  -- annual salary
    100000.00,   -- monthly salary
    3846.15,     -- daily rate
    480.77,      -- hourly rate
    '34-2345678-9',
    '234-567-890-000',
    '23-456789012-3',
    '234567890123',
    'Eduardo Cruz',
    '09215678902',
    'father',
    '456 Innovation Drive, Valencia City, 8709',
    'Eduardo Cruz',
    '1960-02-18',
    'Engineer',
    'Lourdes Ramos',
    '1963-07-30',
    'Nurse'
);

-- Employee 3: Full Stack Developer - 3 years service, age 30+
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
    2,  -- full stack developer
    1,  -- regular
    1,  -- active
    1,  -- default branch
    2,  -- information technology
    '2021-03-15',  -- 3 years service
    '2021-06-15',  -- regularized after 3 months
    'EMP-IT-2021-001',
    'BIO-IT-2021-001',
    'Mark',
    'Torres',
    'Alvarez',
    '1992-05-08',  -- birth date
    1,  -- roman catholic
    1,  -- single
    32,  -- age
    'male',
    1,  -- filipino
    '321 Code Street',
    4,  -- tagum city
    3,  -- ilocos sur
    '8100',
    'mark.torres@company.com',
    '09193456789',
    900000.00,  -- annual salary
    75000.00,   -- monthly salary
    2884.62,    -- daily rate
    360.58,     -- hourly rate
    '34-3456789-0',
    '345-678-901-000',
    '34-567890123-4',
    '345678901234',
    'Jose Torres',
    '09226789013',
    'father',
    '321 Code Street, Tagum City, 8100',
    'Jose Torres',
    '1965-01-20',
    'Accountant',
    'Rosa Alvarez',
    '1967-09-14',
    'Teacher'
);

-- Employee 4: IT Specialist Software - 3 years service, age 28-29
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
    4,  -- it specialist software
    1,  -- regular
    1,  -- active
    1,  -- default branch
    2,  -- information technology
    '2021-08-20',  -- 3 years service
    '2021-11-20',  -- regularized after 3 months
    'EMP-IT-2021-002',
    'BIO-IT-2021-002',
    'Sarah',
    'Garcia',
    'Lopez',
    '1995-11-30',  -- birth date
    1,  -- roman catholic
    1,  -- single
    29,  -- age
    'female',
    1,  -- filipino
    '654 Developer Lane',
    5,  -- digos city
    1,  -- metro manila
    '8002',
    'sarah.garcia@company.com',
    '09204567891',
    780000.00,  -- annual salary
    65000.00,   -- monthly salary
    2500.00,    -- daily rate
    312.50,     -- hourly rate
    '34-4567890-1',
    '456-789-012-000',
    '45-678901234-5',
    '456789012345',
    'Roberto Garcia',
    '09237890124',
    'father',
    '654 Developer Lane, Digos City, 8002',
    'Roberto Garcia',
    '1968-04-12',
    'Business Owner',
    'Maria Lopez',
    '1970-08-22',
    'Housewife'
);

-- Employee 5: IT Specialist Hardware - Less than 1 year, Probationary, age 28, Married
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
    3,  -- it specialist hardware
    2,  -- probationary
    1,  -- active
    1,  -- default branch
    2,  -- information technology
    '2023-10-01',  -- less than 1 year service
    NULL,  -- not yet regularized (probationary)
    'EMP-IT-2023-001',
    'BIO-IT-2023-001',
    'James',
    'Fernandez',
    'Santos',
    '1996-02-14',  -- birth date
    1,  -- roman catholic
    2,  -- married
    28,  -- age
    'male',
    1,  -- filipino
    '987 Hardware Boulevard',
    2,  -- davao city
    1,  -- metro manila
    '8001',
    'james.fernandez@company.com',
    '09215678902',
    660000.00,  -- annual salary
    55000.00,   -- monthly salary
    2115.38,    -- daily rate
    264.42,     -- hourly rate
    '34-5678901-2',
    '567-890-123-000',
    '56-789012345-6',
    '567890123456',
    'Michelle Fernandez',
    '09248901235',
    'spouse',
    '987 Hardware Boulevard, Davao City, 8001',
    'Michelle Fernandez',
    '1997-07-18',
    'Graphic Designer',
    'Manuel Fernandez',
    '1967-03-25',
    'Electrician',
    'Luz Santos',
    '1969-12-08',
    'Nurse'
);

-- Verify the inserted IT Department employees
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
    age
FROM employees
WHERE department_id = 2
  AND deleted_at IS NULL
ORDER BY hire_date ASC;

