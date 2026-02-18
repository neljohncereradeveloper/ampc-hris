-- SQL Queries to Insert Trainings for Accounting Department Employees
-- This file links Accounting employees to training certificates
-- Note: Employee IDs and Certificate IDs need to be verified before running

-- Get Accounting Employee IDs (run this first to get the correct IDs)
-- SELECT id, id_number, first_name, last_name FROM employees WHERE department_id = 12 AND deleted_at IS NULL ORDER BY id;

-- Get Training Certificate IDs (run this first to get the correct IDs)
-- SELECT id, desc1 FROM training_certificates WHERE deleted_at IS NULL ORDER BY id;

-- ============================================
-- Accounting Department Head: Carmen Villanueva
-- Employee ID: (Get from query above, example: 41)
-- ============================================

-- Training 1: Certified Public Accountant (CPA) for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'CPA Certification Training' as training_title,
    'Completed Certified Public Accountant (CPA) certification' as desc1,
    '2014-05-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2013-001'
  AND tc.desc1 = 'Certified Public Accountant (CPA)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Certified Management Accountant (CMA) for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'CMA Certification Training' as training_title,
    'Completed Certified Management Accountant (CMA) certification' as desc1,
    '2016-08-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2013-001'
  AND tc.desc1 = 'Certified Management Accountant (CMA)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Financial Statement Analysis Professional for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Financial Statement Analysis Training' as training_title,
    'Completed Financial Statement Analysis Professional Certification' as desc1,
    '2017-11-22' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2013-001'
  AND tc.desc1 = 'Financial Statement Analysis Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: Audit and Assurance Professional for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Audit and Assurance Training' as training_title,
    'Completed Audit and Assurance Professional Certification' as desc1,
    '2019-03-18' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2013-001'
  AND tc.desc1 = 'Audit and Assurance Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Accounting Supervisor: Michael Torres
-- Employee ID: (Get from query above, example: 42)
-- ============================================

-- Training 1: Certified Public Accountant (CPA) for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'CPA Certification Training' as training_title,
    'Completed Certified Public Accountant (CPA) certification' as desc1,
    '2019-06-10' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2018-001'
  AND tc.desc1 = 'Certified Public Accountant (CPA)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: BIR Tax Compliance Specialist for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'BIR Tax Compliance Training' as training_title,
    'Completed BIR Tax Compliance Specialist Certification' as desc1,
    '2020-02-25' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2018-001'
  AND tc.desc1 = 'BIR Tax Compliance Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Tax Preparation Specialist for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Tax Preparation Training' as training_title,
    'Completed Tax Preparation Specialist Certification' as desc1,
    '2020-08-18' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2018-001'
  AND tc.desc1 = 'Tax Preparation Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: Financial Reporting Specialist for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Financial Reporting Training' as training_title,
    'Completed Financial Reporting Specialist Certification' as desc1,
    '2021-04-12' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2018-001'
  AND tc.desc1 = 'Financial Reporting Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Accounting Supervisor: Patricia Ramos
-- Employee ID: (Get from query above, example: 43)
-- ============================================

-- Training 1: Certified Internal Auditor (CIA) for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'CIA Certification Training' as training_title,
    'Completed Certified Internal Auditor (CIA) certification' as desc1,
    '2020-05-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2019-001'
  AND tc.desc1 = 'Certified Internal Auditor (CIA)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Audit and Assurance Professional for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Audit and Assurance Training' as training_title,
    'Completed Audit and Assurance Professional Certification' as desc1,
    '2020-10-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2019-001'
  AND tc.desc1 = 'Audit and Assurance Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Cost Accounting Specialist for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Cost Accounting Training' as training_title,
    'Completed Cost Accounting Specialist Certification' as desc1,
    '2021-07-28' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2019-001'
  AND tc.desc1 = 'Cost Accounting Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: Financial Accounting Professional for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Financial Accounting Training' as training_title,
    'Completed Financial Accounting Professional Certification' as desc1,
    '2022-01-10' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2019-001'
  AND tc.desc1 = 'Financial Accounting Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Accounting Associate: John Santos
-- Employee ID: (Get from query above, example: 44)
-- ============================================

-- Training 1: Bookkeeping Professional for Accounting Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Bookkeeping Training' as training_title,
    'Completed Bookkeeping Professional Certification' as desc1,
    '2022-06-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2022-001'
  AND tc.desc1 = 'Bookkeeping Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: QuickBooks Certified User for Accounting Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'QuickBooks Training' as training_title,
    'Completed QuickBooks Certified User certification' as desc1,
    '2022-09-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2022-001'
  AND tc.desc1 = 'QuickBooks Certified User'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Accounts Payable Specialist for Accounting Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Accounts Payable Training' as training_title,
    'Completed Accounts Payable Specialist Certification' as desc1,
    '2023-02-18' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2022-001'
  AND tc.desc1 = 'Accounts Payable Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: Accounts Receivable Specialist for Accounting Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Accounts Receivable Training' as training_title,
    'Completed Accounts Receivable Specialist Certification' as desc1,
    '2023-05-25' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2022-001'
  AND tc.desc1 = 'Accounts Receivable Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Accounting Associate: Sarah Garcia
-- Employee ID: (Get from query above, example: 45)
-- ============================================

-- Training 1: Bookkeeping Professional for Accounting Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Bookkeeping Training' as training_title,
    'Completed Bookkeeping Professional Certification' as desc1,
    '2023-10-12' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2023-001'
  AND tc.desc1 = 'Bookkeeping Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Xero Certified Advisor for Accounting Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Xero Training' as training_title,
    'Completed Xero Certified Advisor certification' as desc1,
    '2023-12-08' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2023-001'
  AND tc.desc1 = 'Xero Certified Advisor'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Accounts Payable Specialist for Accounting Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Accounts Payable Training' as training_title,
    'Completed Accounts Payable Specialist Certification' as desc1,
    '2024-01-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2023-001'
  AND tc.desc1 = 'Accounts Payable Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: Financial Accounting Professional for Accounting Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Financial Accounting Training' as training_title,
    'Completed Financial Accounting Professional Certification' as desc1,
    '2024-02-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ACC-2023-001'
  AND tc.desc1 = 'Financial Accounting Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Verification Query
-- ============================================
-- Verify all Accounting employee trainings
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
WHERE e.department_id = 12
  AND e.deleted_at IS NULL
  AND t.deleted_at IS NULL
ORDER BY e.id_number, t.training_date DESC;

