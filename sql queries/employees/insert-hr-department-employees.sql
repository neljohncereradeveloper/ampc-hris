-- SQL Queries to Insert HR Department Employees
-- Department: Human Resources (id: 1)
-- Employment Status: active (id: 1)
-- Employment Type: regular (id: 1)

-- Employee 1: Department Head - 20 years service, age 48, married
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
    1,  -- human resources
    '2004-01-15',  -- 20 years service
    '2004-04-15',  -- regularized after 3 months
    'EMP-HR-2004-001',
    'BIO-HR-2004-001',
    'Elena',
    'Reyes',
    'Cruz',
    '1976-05-10',  -- birth date (age 48)
    1,  -- roman catholic
    2,  -- married
    48,  -- age
    'female',
    1,  -- filipino
    '123 HR Management Plaza',
    2,  -- davao city
    1,  -- metro manila
    '8000',
    'elena.reyes@company.com',
    '09171234567',
    2000000.00,  -- annual salary
    166666.67,   -- monthly salary
    6410.26,     -- daily rate
    801.28,      -- hourly rate
    '34-1234567-8',
    '123-456-789-000',
    '12-345678901-2',
    '123456789012',
    'Roberto Reyes',
    '09204567891',
    'spouse',
    '123 HR Management Plaza, Davao City, 8000',
    'Roberto Reyes',
    '1974-08-20',
    'Business Consultant',
    'Carlos Reyes',
    '1948-03-15',
    'Retired Government Employee',
    'Carmen Cruz',
    '1950-11-28',
    'Retired Teacher'
);

-- Employee 2: Payroll Master - 1 year service, age 37, married
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
    8,  -- payroll master
    1,  -- regular
    1,  -- active
    1,  -- default branch
    1,  -- human resources
    '2023-02-01',  -- 1 year service
    '2023-05-01',  -- regularized after 3 months
    'EMP-HR-2023-001',
    'BIO-HR-2023-001',
    'Maria',
    'Santos',
    'Lopez',
    '1987-09-25',  -- birth date (age 37)
    1,  -- roman catholic
    2,  -- married
    37,  -- age
    'female',
    1,  -- filipino
    '456 Payroll Center Street',
    3,  -- valencia city
    2,  -- ilocos norte
    '8709',
    'maria.santos@company.com',
    '09182345678',
    960000.00,  -- annual salary
    80000.00,   -- monthly salary
    3076.92,    -- daily rate
    384.62,     -- hourly rate
    '34-2345678-9',
    '234-567-890-000',
    '23-456789012-3',
    '234567890123',
    'Jose Santos',
    '09215678902',
    'spouse',
    '456 Payroll Center Street, Valencia City, 8709',
    'Jose Santos',
    '1985-12-10',
    'Accountant',
    'Manuel Santos',
    '1960-06-18',
    'Retired Bank Manager',
    'Rosa Lopez',
    '1963-03-22',
    'Housewife'
);

-- Employee 3: HR Supervisor - 5 years service, married
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
    7,  -- supervisor
    1,  -- regular
    1,  -- active
    1,  -- default branch
    1,  -- human resources
    '2019-06-15',  -- 5 years service
    '2019-09-15',  -- regularized after 3 months
    'EMP-HR-2019-001',
    'BIO-HR-2019-001',
    'Roberto',
    'Garcia',
    'Fernandez',
    '1988-11-30',  -- birth date (age 36)
    1,  -- roman catholic
    2,  -- married
    36,  -- age
    'male',
    1,  -- filipino
    '789 HR Supervision Avenue',
    4,  -- tagum city
    3,  -- ilocos sur
    '8100',
    'roberto.garcia@company.com',
    '09193456789',
    1200000.00,  -- annual salary
    100000.00,   -- monthly salary
    3846.15,     -- daily rate
    480.77,      -- hourly rate
    '34-3456789-0',
    '345-678-901-000',
    '34-567890123-4',
    '345678901234',
    'Catherine Garcia',
    '09226789013',
    'spouse',
    '789 HR Supervision Avenue, Tagum City, 8100',
    'Catherine Garcia',
    '1990-04-18',
    'HR Manager',
    'Eduardo Garcia',
    '1962-01-25',
    'Engineer',
    'Luz Fernandez',
    '1965-07-12',
    'Nurse'
);

-- Employee 4: HR Specialist - Less than 2 years service, age 20-30
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
    9,  -- hr specialist
    1,  -- regular
    1,  -- active
    1,  -- default branch
    1,  -- human resources
    '2023-05-01',  -- less than 2 years service
    '2023-08-01',  -- regularized after 3 months
    'EMP-HR-2023-002',
    'BIO-HR-2023-002',
    'Patricia',
    'Alvarez',
    'Torres',
    '1996-08-15',  -- birth date (age 28)
    1,  -- roman catholic
    1,  -- single
    28,  -- age
    'female',
    1,  -- filipino
    '321 HR Specialist Lane',
    5,  -- digos city
    1,  -- metro manila
    '8002',
    'patricia.alvarez@company.com',
    '09204567891',
    720000.00,  -- annual salary
    60000.00,   -- monthly salary
    2307.69,    -- daily rate
    288.46,     -- hourly rate
    '34-4567890-1',
    '456-789-012-000',
    '45-678901234-5',
    '456789012345',
    'Ricardo Alvarez',
    '09237890124',
    'father',
    '321 HR Specialist Lane, Digos City, 8002',
    'Ricardo Alvarez',
    '1968-02-14',
    'Business Owner',
    'Maria Torres',
    '1970-10-08',
    'Teacher'
);

-- Employee 5: HR Specialist - Less than 2 years service, age 20-30
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
    9,  -- hr specialist
    1,  -- regular
    1,  -- active
    1,  -- default branch
    1,  -- human resources
    '2023-08-20',  -- less than 2 years service
    '2023-11-20',  -- regularized after 3 months
    'EMP-HR-2023-003',
    'BIO-HR-2023-003',
    'John',
    'Villanueva',
    'Mendoza',
    '1998-03-22',  -- birth date (age 26)
    1,  -- roman catholic
    1,  -- single
    26,  -- age
    'male',
    1,  -- filipino
    '654 HR Services Road',
    2,  -- davao city
    1,  -- metro manila
    '8001',
    'john.villanueva@company.com',
    '09215678902',
    660000.00,  -- annual salary
    55000.00,   -- monthly salary
    2115.38,    -- daily rate
    264.42,     -- hourly rate
    '34-5678901-2',
    '567-890-123-000',
    '56-789012345-6',
    '567890123456',
    'Manuel Villanueva',
    '09248901235',
    'father',
    '654 HR Services Road, Davao City, 8001',
    'Manuel Villanueva',
    '1970-05-30',
    'Engineer',
    'Carmen Mendoza',
    '1972-12-15',
    'Accountant'
);

-- Employee 6: HR Specialist - Different service period, age 20-30
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
    9,  -- hr specialist
    1,  -- regular
    1,  -- active
    1,  -- default branch
    1,  -- human resources
    '2022-11-10',  -- more than 2 years service
    '2023-02-10',  -- regularized after 3 months
    'EMP-HR-2022-001',
    'BIO-HR-2022-001',
    'Michelle',
    'Ramos',
    'Cruz',
    '1994-07-18',  -- birth date (age 30)
    1,  -- roman catholic
    1,  -- single
    30,  -- age
    'female',
    1,  -- filipino
    '987 HR Development Boulevard',
    3,  -- valencia city
    2,  -- ilocos norte
    '8708',
    'michelle.ramos@company.com',
    '09226789013',
    780000.00,  -- annual salary
    65000.00,   -- monthly salary
    2500.00,    -- daily rate
    312.50,     -- hourly rate
    '34-6789012-3',
    '678-901-234-000',
    '67-890123456-7',
    '678901234567',
    'Eduardo Ramos',
    '09237890124',
    'father',
    '987 HR Development Boulevard, Valencia City, 8708',
    'Eduardo Ramos',
    '1966-09-25',
    'Police Officer',
    'Grace Cruz',
    '1969-04-11',
    'Nurse'
);

-- Verify the inserted HR Department employees
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
WHERE department_id = 1
  AND deleted_at IS NULL
ORDER BY hire_date ASC;

