-- SQL Queries to Insert Marketing Department Employees
-- Department: Marketing (id: 5)
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
    5,  -- marketing
    '2015-03-01',  -- 9 years service
    '2015-06-01',  -- regularized after 3 months
    'EMP-MKT-2015-001',
    'BIO-MKT-2015-001',
    'Andrea',
    'Martinez',
    'Dela Cruz',
    '1980-08-12',  -- birth date (age 44)
    1,  -- roman catholic
    2,  -- married
    44,  -- age
    'female',
    1,  -- filipino
    1,  -- default
    '123 Marketing Excellence Avenue',
    2,  -- davao city
    1,  -- metro manila
    '8000',
    'andrea.martinez@company.com',
    '09171234567',
    1800000.00,  -- annual salary
    150000.00,   -- monthly salary
    5769.23,     -- daily rate
    721.15,      -- hourly rate
    '34-1234567-8',
    '123-456-789-000',
    '12-345678901-2',
    '123456789012',
    'Michael Martinez',
    '09204567891',
    'spouse',
    '123 Marketing Excellence Avenue, Davao City, 8000',
    'Michael Martinez',
    '1978-11-20',
    'Business Development Manager',
    'Roberto Martinez',
    '1952-04-15',
    'Retired Marketing Director',
    'Carmen Dela Cruz',
    '1955-09-28',
    'Retired Teacher'
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
    5,  -- marketing
    '2020-07-15',  -- 4 years service
    '2020-10-15',  -- regularized after 3 months
    'EMP-MKT-2020-001',
    'BIO-MKT-2020-001',
    'David',
    'Tan',
    'Lim',
    '1991-02-28',  -- birth date (age 33)
    1,  -- roman catholic
    1,  -- single
    33,  -- age
    'male',
    1,  -- filipino
    1,  -- default
    '456 Brand Strategy Street',
    3,  -- valencia city
    2,  -- ilocos norte
    '8709',
    'david.tan@company.com',
    '09182345678',
    1200000.00,  -- annual salary
    100000.00,   -- monthly salary
    3846.15,     -- daily rate
    480.77,      -- hourly rate
    '34-2345678-9',
    '234-567-890-000',
    '23-456789012-3',
    '234567890123',
    'Ricardo Tan',
    '09215678902',
    'father',
    '456 Brand Strategy Street, Valencia City, 8709',
    'Ricardo Tan',
    '1965-06-10',
    'Business Owner',
    'Maria Lim',
    '1968-03-22',
    'Accountant'
);

-- Employee 3: Marketing Associate
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
    7,  -- supervisor (marketing associate - using supervisor as replacement)
    1,  -- regular
    1,  -- active
    1,  -- default branch
    5,  -- marketing
    '2023-01-10',  -- 1 year service
    '2023-04-10',  -- regularized after 3 months
    'EMP-MKT-2023-001',
    'BIO-MKT-2023-001',
    'Sophia',
    'Chen',
    'Wong',
    '1997-05-18',  -- birth date
    1,  -- roman catholic
    1,  -- single
    27,  -- age
    'female',
    1,  -- filipino
    1,  -- default
    '789 Digital Marketing Lane',
    4,  -- tagum city
    3,  -- ilocos sur
    '8100',
    'sophia.chen@company.com',
    '09193456789',
    720000.00,  -- annual salary
    60000.00,   -- monthly salary
    2307.69,    -- daily rate
    288.46,     -- hourly rate
    '34-3456789-0',
    '345-678-901-000',
    '34-567890123-4',
    '345678901234',
    'Eduardo Chen',
    '09226789013',
    'father',
    '789 Digital Marketing Lane, Tagum City, 8100',
    'Eduardo Chen',
    '1970-08-25',
    'Marketing Manager',
    'Grace Wong',
    '1972-12-14',
    'Graphic Designer'
);


