-- SQL Queries to Insert Accounting Department Employees
-- Department: Accounting (id: 4)
-- Employment Status: active (id: 1)
-- Employment Type: regular (id: 1)

-- Employee 1: Department Head
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
    citizen_ship_id,
    home_address_barangay_id,
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
    4,  -- accounting
    '2013-06-01',  -- 11 years service
    '2013-09-01',  -- regularized after 3 months
    'EMP-ACC-2013-001',
    'BIO-ACC-2013-001',
    'Carmen',
    'Villanueva',
    'Mendoza',
    '1978-09-18',  -- birth date (age 46)
    1,  -- roman catholic
    2,  -- married
    46,  -- age
    'female',
    1,  -- filipino
    1,  -- default
    '123 Accounting Excellence Plaza',
    2,  -- davao city
    1,  -- metro manila
    '8000',
    'carmen.villanueva@company.com',
    '09171234567',
    1800000.00,  -- annual salary
    150000.00,   -- monthly salary
    5769.23,     -- daily rate
    721.15,      -- hourly rate
    '34-1234567-8',
    '123-456-789-000',
    '12-345678901-2',
    '123456789012',
    'Roberto Villanueva',
    '09204567891',
    'spouse',
    '123 Accounting Excellence Plaza, Davao City, 8000',
    'Roberto Villanueva',
    '1976-12-05',
    'CPA - Tax Consultant',
    'Manuel Villanueva',
    '1950-07-20',
    'Retired Accountant',
    'Luz Mendoza',
    '1953-02-14',
    'Retired Bookkeeper'
);

-- Employee 2: Supervisor
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
    citizen_ship_id,
    home_address_barangay_id,
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
    4,  -- accounting
    '2018-04-15',  -- 6 years service
    '2018-07-15',  -- regularized after 3 months
    'EMP-ACC-2018-001',
    'BIO-ACC-2018-001',
    'Michael',
    'Torres',
    'Alvarez',
    '1989-03-25',  -- birth date (age 35)
    1,  -- roman catholic
    1,  -- single
    35,  -- age
    'male',
    1,  -- filipino
    1,  -- default
    '456 Financial Control Street',
    3,  -- valencia city
    2,  -- ilocos norte
    '8709',
    'michael.torres@company.com',
    '09182345678',
    1200000.00,  -- annual salary
    100000.00,   -- monthly salary
    3846.15,     -- daily rate
    480.77,      -- hourly rate
    '34-2345678-9',
    '234-567-890-000',
    '23-456789012-3',
    '234567890123',
    'Jose Torres',
    '09215678902',
    'father',
    '456 Financial Control Street, Valencia City, 8709',
    'Jose Torres',
    '1963-08-10',
    'CPA',
    'Rosa Alvarez',
    '1966-11-22',
    'Accountant'
);

-- Employee 3: Supervisor
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
    citizen_ship_id,
    home_address_barangay_id,
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
    4,  -- accounting
    '2019-08-20',  -- 5 years service
    '2019-11-20',  -- regularized after 3 months
    'EMP-ACC-2019-001',
    'BIO-ACC-2019-001',
    'Patricia',
    'Ramos',
    'Cruz',
    '1990-07-12',  -- birth date (age 34)
    1,  -- roman catholic
    2,  -- married
    34,  -- age
    'female',
    1,  -- filipino
    1,  -- default
    '789 Audit Compliance Lane',
    4,  -- tagum city
    3,  -- ilocos sur
    '8100',
    'patricia.ramos@company.com',
    '09193456789',
    1140000.00,  -- annual salary
    95000.00,    -- monthly salary
    3653.85,     -- daily rate
    456.73,      -- hourly rate
    '34-3456789-0',
    '345-678-901-000',
    '34-567890123-4',
    '345678901234',
    'Carlos Ramos',
    '09226789013',
    'spouse',
    '789 Audit Compliance Lane, Tagum City, 8100',
    'Carlos Ramos',
    '1988-05-18',
    'Financial Analyst',
    'Eduardo Ramos',
    '1965-01-30',
    'Retired Auditor',
    'Grace Cruz',
    '1968-09-15',
    'Bookkeeper'
);

-- Employee 4: Accounting Associate
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
    citizen_ship_id,
    home_address_barangay_id,
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
    7,  -- supervisor (accounting associate - using supervisor as replacement)
    1,  -- regular
    1,  -- active
    1,  -- default branch
    4,  -- accounting
    '2022-03-10',  -- 2 years service
    '2022-06-10',  -- regularized after 3 months
    'EMP-ACC-2022-001',
    'BIO-ACC-2022-001',
    'John',
    'Santos',
    'Fernandez',
    '1996-11-28',  -- birth date (age 28)
    1,  -- roman catholic
    1,  -- single
    28,  -- age
    'male',
    1,  -- filipino
    1,  -- default
    '321 Bookkeeping Boulevard',
    5,  -- digos city
    1,  -- metro manila
    '8002',
    'john.santos@company.com',
    '09204567891',
    720000.00,  -- annual salary
    60000.00,   -- monthly salary
    2307.69,   -- daily rate
    288.46,     -- hourly rate
    '34-4567890-1',
    '456-789-012-000',
    '45-678901234-5',
    '456789012345',
    'Manuel Santos',
    '09237890124',
    'father',
    '321 Bookkeeping Boulevard, Digos City, 8002',
    'Manuel Santos',
    '1971-04-12',
    'Accountant',
    'Carmen Fernandez',
    '1973-08-25',
    'Teacher'
);

-- Employee 5: Accounting Associate
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
    citizen_ship_id,
    home_address_barangay_id,
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
    7,  -- supervisor (accounting associate - using supervisor as replacement)
    1,  -- regular
    1,  -- active
    1,  -- default branch
    4,  -- accounting
    '2023-07-05',  -- 1 year service
    '2023-10-05',  -- regularized after 3 months
    'EMP-ACC-2023-001',
    'BIO-ACC-2023-001',
    'Sarah',
    'Garcia',
    'Lopez',
    '1997-04-15',  -- birth date (age 27)
    1,  -- roman catholic
    1,  -- single
    27,  -- age
    'female',
    1,  -- filipino
    1,  -- default
    '654 Accounts Payable Road',
    2,  -- davao city
    1,  -- metro manila
    '8001',
    'sarah.garcia@company.com',
    '09215678902',
    660000.00,  -- annual salary
    55000.00,   -- monthly salary
    2115.38,    -- daily rate
    264.42,     -- hourly rate
    '34-5678901-2',
    '567-890-123-000',
    '56-789012345-6',
    '567890123456',
    'Roberto Garcia',
    '09248901235',
    'father',
    '654 Accounts Payable Road, Davao City, 8001',
    'Roberto Garcia',
    '1972-06-20',
    'CPA',
    'Maria Lopez',
    '1974-10-08',
    'Accountant'
);



