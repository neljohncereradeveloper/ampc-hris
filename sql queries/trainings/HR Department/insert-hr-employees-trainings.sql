-- SQL Queries to Insert Trainings for HR Department Employees
-- This file links HR employees to training certificates
-- Note: Employee IDs and Certificate IDs need to be verified before running

-- Get HR Employee IDs (run this first to get the correct IDs)
-- SELECT id, id_number, first_name, last_name FROM employees WHERE department_id = 9 AND deleted_at IS NULL ORDER BY id;

-- Get Training Certificate IDs (run this first to get the correct IDs)
-- SELECT id, desc1 FROM training_certificates WHERE deleted_at IS NULL ORDER BY id;

-- ============================================
-- HR Department Head: Elena Reyes
-- Employee ID: (Get from query above, example: 25)
-- ============================================

-- Training 1: SHRM Certified Professional for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'SHRM Certification Training' as training_title,
    'Completed SHRM Certified Professional (SHRM-CP) certification' as desc1,
    '2010-08-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2004-001'
  AND tc.desc1 = 'SHRM Certified Professional (SHRM-CP)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Strategic Human Resource Management for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Strategic HR Management Training' as training_title,
    'Completed Strategic Human Resource Management Certification' as desc1,
    '2012-05-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2004-001'
  AND tc.desc1 = 'Strategic Human Resource Management Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: DOLE Compliance Specialist for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'DOLE Compliance Training' as training_title,
    'Completed DOLE Compliance Specialist Certification' as desc1,
    '2015-11-10' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2004-001'
  AND tc.desc1 = 'DOLE Compliance Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: Organizational Development Professional for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Organizational Development Training' as training_title,
    'Completed Organizational Development Professional Certification' as desc1,
    '2018-03-22' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2004-001'
  AND tc.desc1 = 'Organizational Development Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Payroll Master: Maria Santos
-- Employee ID: (Get from query above, example: 26)
-- ============================================

-- Training 1: Certified Payroll Professional for Payroll Master
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Certified Payroll Professional Training' as training_title,
    'Completed Certified Payroll Professional (CPP) certification' as desc1,
    '2023-05-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2023-001'
  AND tc.desc1 = 'Certified Payroll Professional (CPP)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Philippine Labor Law Compliance for Payroll Master
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Philippine Labor Law Training' as training_title,
    'Completed Philippine Labor Law Compliance Certification' as desc1,
    '2023-08-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2023-001'
  AND tc.desc1 = 'Philippine Labor Law Compliance Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Compensation and Benefits Specialist for Payroll Master
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Compensation and Benefits Training' as training_title,
    'Completed Compensation and Benefits Specialist Certification' as desc1,
    '2023-10-12' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2023-001'
  AND tc.desc1 = 'Compensation and Benefits Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- HR Supervisor: Roberto Garcia
-- Employee ID: (Get from query above, example: 27)
-- ============================================

-- Training 1: HRCI Professional in Human Resources for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'HRCI PHR Training' as training_title,
    'Completed HRCI Professional in Human Resources (PHR) certification' as desc1,
    '2020-09-18' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2019-001'
  AND tc.desc1 = 'HRCI Professional in Human Resources (PHR)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Performance Management Professional for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Performance Management Training' as training_title,
    'Completed Performance Management Professional Certification' as desc1,
    '2021-04-25' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2019-001'
  AND tc.desc1 = 'Performance Management Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Employee Relations Specialist for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Employee Relations Training' as training_title,
    'Completed Employee Relations Specialist Certification' as desc1,
    '2022-07-30' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2019-001'
  AND tc.desc1 = 'Employee Relations Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- HR Specialist: Patricia Alvarez
-- Employee ID: (Get from query above, example: 28)
-- ============================================

-- Training 1: Recruitment and Selection Specialist for HR Specialist
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Recruitment and Selection Training' as training_title,
    'Completed Recruitment and Selection Specialist Certification' as desc1,
    '2023-08-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2023-002'
  AND tc.desc1 = 'Recruitment and Selection Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Talent Acquisition Specialist for HR Specialist
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Talent Acquisition Training' as training_title,
    'Completed Talent Acquisition Specialist Certification' as desc1,
    '2023-11-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2023-002'
  AND tc.desc1 = 'Talent Acquisition Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- HR Specialist: John Villanueva
-- Employee ID: (Get from query above, example: 29)
-- ============================================

-- Training 1: Training and Development Professional for HR Specialist
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Training and Development Training' as training_title,
    'Completed Training and Development Professional Certification' as desc1,
    '2023-09-10' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2023-003'
  AND tc.desc1 = 'Training and Development Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: HR Analytics Professional for HR Specialist
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'HR Analytics Training' as training_title,
    'Completed HR Analytics Professional Certification' as desc1,
    '2024-01-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2023-003'
  AND tc.desc1 = 'HR Analytics Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- HR Specialist: Michelle Ramos
-- Employee ID: (Get from query above, example: 30)
-- ============================================

-- Training 1: Philippine Labor Law Compliance for HR Specialist
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Philippine Labor Law Training' as training_title,
    'Completed Philippine Labor Law Compliance Certification' as desc1,
    '2023-03-25' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2022-001'
  AND tc.desc1 = 'Philippine Labor Law Compliance Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Recruitment and Selection Specialist for HR Specialist
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Recruitment and Selection Training' as training_title,
    'Completed Recruitment and Selection Specialist Certification' as desc1,
    '2023-06-18' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2022-001'
  AND tc.desc1 = 'Recruitment and Selection Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Performance Management Professional for HR Specialist
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Performance Management Training' as training_title,
    'Completed Performance Management Professional Certification' as desc1,
    '2023-09-12' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-HR-2022-001'
  AND tc.desc1 = 'Performance Management Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Verification Query
-- ============================================
-- Verify all HR employee trainings
SELECT 
    t.id as training_id,
    e.id_number,
    e.first_name,
    e.last_name,
    (SELECT desc1 FROM job_titles WHERE id = e.job_title_id) as job_title,
    t.training_title,
    t.desc1 as training_description,
    t.training_date,
    tc.desc1 as certificate_name
FROM trainings t
INNER JOIN employees e ON t.employee_id = e.id
INNER JOIN training_certificates tc ON t.trainings_cert_id = tc.id
WHERE e.department_id = 9
  AND e.deleted_at IS NULL
  AND t.deleted_at IS NULL
ORDER BY e.id_number, t.training_date DESC;

