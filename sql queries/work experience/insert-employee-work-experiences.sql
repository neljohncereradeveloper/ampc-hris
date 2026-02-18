-- SQL Queries to Insert Work Experiences for Employees
-- This file links employees to work experience companies and job titles
-- Note: Employee IDs, Company IDs, and Job Title IDs need to be verified before running

-- Get Employee IDs (run this first to get the correct IDs)
-- SELECT id, id_number, first_name, last_name FROM employees WHERE deleted_at IS NULL ORDER BY id;

-- Get Company IDs (run this first to get the correct IDs)
-- SELECT id, desc1 FROM work_experience_companies WHERE deleted_at IS NULL ORDER BY id;

-- Get Job Title IDs (run this first to get the correct IDs)
-- SELECT id, desc1 FROM work_experience_job_titles WHERE deleted_at IS NULL ORDER BY id;

-- ============================================
-- IT Department Employees
-- ============================================

-- Work Experience 1 for Ricardo Mendoza (EMP-IT-2012-001) - Department Head
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '3' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-IT-2012-001'
  AND c.desc1 = 'Accenture Philippines'
  AND jt.desc1 = 'Senior Software Developer'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Ricardo Mendoza
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-IT-2012-001'
  AND c.desc1 = 'IBM Philippines'
  AND jt.desc1 = 'IT Project Manager'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Daniel Cruz (EMP-IT-2019-001) - Supervisor
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-IT-2019-001'
  AND c.desc1 = 'Cognizant Technology Solutions Philippines'
  AND jt.desc1 = 'Software Developer'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Daniel Cruz
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-IT-2019-001'
  AND c.desc1 = 'DXC Technology Philippines'
  AND jt.desc1 = 'System Administrator'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Mark Torres (EMP-IT-2021-001) - Full Stack Developer
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-IT-2021-001'
  AND c.desc1 = 'Pointwest Technologies'
  AND jt.desc1 = 'Junior Software Developer'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Mark Torres
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-IT-2021-001'
  AND c.desc1 = 'Orange & Bronze Software Labs'
  AND jt.desc1 = 'Web Developer'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Sarah Garcia (EMP-IT-2021-002) - IT Specialist Software
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-IT-2021-002'
  AND c.desc1 = 'Globe Telecom'
  AND jt.desc1 = 'Software Engineer'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Sarah Garcia
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-IT-2021-002'
  AND c.desc1 = 'PLDT Inc.'
  AND jt.desc1 = 'Frontend Developer'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for James Fernandez (EMP-IT-2023-001) - IT Specialist Hardware
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-IT-2023-001'
  AND c.desc1 = 'Accenture Philippines'
  AND jt.desc1 = 'IT Support Specialist'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- ============================================
-- HR Department Employees
-- ============================================

-- Work Experience 1 for Elena Reyes (EMP-HR-2004-001) - Department Head
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '4' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-HR-2004-001'
  AND c.desc1 = 'Concentrix Philippines'
  AND jt.desc1 = 'HR Generalist'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Elena Reyes
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '3' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-HR-2004-001'
  AND c.desc1 = 'Teleperformance Philippines'
  AND jt.desc1 = 'HR Coordinator'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 3 for Elena Reyes
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-HR-2004-001'
  AND c.desc1 = 'Ayala Corporation'
  AND jt.desc1 = 'Recruitment Specialist'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Maria Santos (EMP-HR-2023-001) - Payroll Master
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-HR-2023-001'
  AND c.desc1 = 'TaskUs Philippines'
  AND jt.desc1 = 'Payroll Assistant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Maria Santos
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-HR-2023-001'
  AND c.desc1 = 'Sitel Philippines'
  AND jt.desc1 = 'HR Assistant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Roberto Garcia (EMP-HR-2019-001) - Supervisor
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-HR-2019-001'
  AND c.desc1 = 'SM Investments Corporation'
  AND jt.desc1 = 'HR Coordinator'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Roberto Garcia
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-HR-2019-001'
  AND c.desc1 = 'BDO Unibank, Inc.'
  AND jt.desc1 = 'Compensation and Benefits Specialist'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Patricia Alvarez (EMP-HR-2023-002) - HR Specialist
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-HR-2023-002'
  AND c.desc1 = 'Concentrix Philippines'
  AND jt.desc1 = 'HR Assistant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for John Villanueva (EMP-HR-2023-003) - HR Specialist
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-HR-2023-003'
  AND c.desc1 = 'Teleperformance Philippines'
  AND jt.desc1 = 'Training Coordinator'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Michelle Ramos (EMP-HR-2022-001) - HR Specialist
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-HR-2022-001'
  AND c.desc1 = 'TaskUs Philippines'
  AND jt.desc1 = 'Recruitment Specialist'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Michelle Ramos
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-HR-2022-001'
  AND c.desc1 = 'Sitel Philippines'
  AND jt.desc1 = 'HR Coordinator'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- ============================================
-- Marketing Department Employees
-- ============================================

-- Work Experience 1 for Andrea Martinez (EMP-MKT-2015-001) - Department Head
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '3' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-MKT-2015-001'
  AND c.desc1 = 'Ogilvy Philippines'
  AND jt.desc1 = 'Marketing Manager'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Andrea Martinez
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-MKT-2015-001'
  AND c.desc1 = 'Dentsu Philippines'
  AND jt.desc1 = 'Brand Manager'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 3 for Andrea Martinez
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-MKT-2015-001'
  AND c.desc1 = 'Jollibee Foods Corporation'
  AND jt.desc1 = 'Marketing Coordinator'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for David Tan (EMP-MKT-2020-001) - Supervisor
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-MKT-2020-001'
  AND c.desc1 = 'McCann Worldgroup Philippines'
  AND jt.desc1 = 'Digital Marketing Specialist'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for David Tan
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-MKT-2020-001'
  AND c.desc1 = 'BBDO Guerrero Philippines'
  AND jt.desc1 = 'Social Media Specialist'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Sophia Chen (EMP-MKT-2023-001) - Marketing Associate
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-MKT-2023-001'
  AND c.desc1 = 'Universal Robina Corporation (URC)'
  AND jt.desc1 = 'Marketing Assistant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Sophia Chen
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-MKT-2023-001'
  AND c.desc1 = 'San Miguel Corporation'
  AND jt.desc1 = 'Content Writer'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- ============================================
-- Administration Department Employees
-- ============================================

-- Work Experience 1 for Roberto Fernandez (EMP-ADMIN-2010-001) - General Manager
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '5' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ADMIN-2010-001'
  AND c.desc1 = 'Ayala Corporation'
  AND jt.desc1 = 'Operations Manager'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Roberto Fernandez
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '3' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ADMIN-2010-001'
  AND c.desc1 = 'SM Investments Corporation'
  AND jt.desc1 = 'Business Manager'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 3 for Roberto Fernandez
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ADMIN-2010-001'
  AND c.desc1 = 'JG Summit Holdings, Inc.'
  AND jt.desc1 = 'Department Manager'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Jennifer Lopez (EMP-ADMIN-2021-001) - Supervisor
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ADMIN-2021-001'
  AND c.desc1 = 'BDO Unibank, Inc.'
  AND jt.desc1 = 'Executive Assistant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Jennifer Lopez
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ADMIN-2021-001'
  AND c.desc1 = 'Bank of the Philippine Islands (BPI)'
  AND jt.desc1 = 'Administrative Assistant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Christine Garcia (EMP-ADMIN-2022-001) - Supervisor
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ADMIN-2022-001'
  AND c.desc1 = 'Metrobank'
  AND jt.desc1 = 'Office Manager'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Christine Garcia
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ADMIN-2022-001'
  AND c.desc1 = 'Security Bank Corporation'
  AND jt.desc1 = 'Administrative Assistant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- ============================================
-- Accounting Department Employees
-- ============================================

-- Work Experience 1 for Carmen Villanueva (EMP-ACC-2013-001) - Department Head
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '4' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ACC-2013-001'
  AND c.desc1 = 'SGV & Co. (SyCip Gorres Velayo & Co.)'
  AND jt.desc1 = 'Senior Accountant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Carmen Villanueva
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '3' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ACC-2013-001'
  AND c.desc1 = 'PwC Philippines (PricewaterhouseCoopers)'
  AND jt.desc1 = 'Tax Accountant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 3 for Carmen Villanueva
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ACC-2013-001'
  AND c.desc1 = 'Deloitte Philippines'
  AND jt.desc1 = 'Internal Auditor'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Michael Torres (EMP-ACC-2018-001) - Supervisor
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ACC-2018-001'
  AND c.desc1 = 'KPMG Philippines'
  AND jt.desc1 = 'Staff Accountant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Michael Torres
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ACC-2018-001'
  AND c.desc1 = 'Ernst & Young Philippines'
  AND jt.desc1 = 'Junior Accountant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Patricia Ramos (EMP-ACC-2019-001) - Supervisor
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '2' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ACC-2019-001'
  AND c.desc1 = 'BDO Unibank, Inc.'
  AND jt.desc1 = 'Internal Auditor'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Patricia Ramos
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ACC-2019-001'
  AND c.desc1 = 'Bank of the Philippine Islands (BPI)'
  AND jt.desc1 = 'Staff Accountant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for John Santos (EMP-ACC-2022-001) - Accounting Associate
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ACC-2022-001'
  AND c.desc1 = 'Metrobank'
  AND jt.desc1 = 'Accounting Assistant'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for John Santos
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ACC-2022-001'
  AND c.desc1 = 'RCBC (Rizal Commercial Banking Corporation)'
  AND jt.desc1 = 'Bookkeeper'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 1 for Sarah Garcia (EMP-ACC-2023-001) - Accounting Associate
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ACC-2023-001'
  AND c.desc1 = 'Security Bank Corporation'
  AND jt.desc1 = 'Accounts Payable Clerk'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- Work Experience 2 for Sarah Garcia
INSERT INTO work_experiences (
    employee_id,
    company_id,
    work_experience_job_title_id,
    years
)
SELECT 
    e.id as employee_id,
    c.id as company_id,
    jt.id as work_experience_job_title_id,
    '1' as years
FROM employees e
CROSS JOIN work_experience_companies c
CROSS JOIN work_experience_job_titles jt
WHERE e.id_number = 'EMP-ACC-2023-001'
  AND c.desc1 = 'Aboitiz Equity Ventures, Inc.'
  AND jt.desc1 = 'Accounts Receivable Clerk'
  AND e.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND jt.deleted_at IS NULL;

-- ============================================
-- Verification Query
-- ============================================
-- Verify all employee work experiences
SELECT 
    we.id as work_experience_id,
    e.id_number,
    e.first_name,
    e.last_name,
    (SELECT desc1 FROM departments WHERE id = e.department_id) as department,
    c.desc1 as company_name,
    jt.desc1 as job_title,
    we.years as years_of_experience
FROM work_experiences we
INNER JOIN employees e ON we.employee_id = e.id
LEFT JOIN work_experience_companies c ON we.company_id = c.id
LEFT JOIN work_experience_job_titles jt ON we.work_experience_job_title_id = jt.id
WHERE we.deleted_at IS NULL
  AND e.deleted_at IS NULL
ORDER BY e.id_number, we.id;

