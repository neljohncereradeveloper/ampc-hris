-- SQL Queries to Insert Trainings for Administration Department Employees
-- This file links Administration employees to training certificates
-- Note: Employee IDs and Certificate IDs need to be verified before running

-- Get Administration Employee IDs (run this first to get the correct IDs)
-- SELECT id, id_number, first_name, last_name FROM employees WHERE department_id = 14 AND deleted_at IS NULL ORDER BY id;

-- Get Training Certificate IDs (run this first to get the correct IDs)
-- SELECT id, desc1 FROM training_certificates WHERE deleted_at IS NULL ORDER BY id;

-- ============================================
-- Administration General Manager: Roberto Fernandez
-- Employee ID: (Get from query above, example: 34)
-- ============================================

-- Training 1: Project Management Professional (PMP) for General Manager
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'PMP Certification Training' as training_title,
    'Completed Project Management Professional (PMP) certification' as desc1,
    '2011-08-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2010-001'
  AND tc.desc1 = 'Project Management Professional (PMP)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Executive Leadership Program for General Manager
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Executive Leadership Training' as training_title,
    'Completed Executive Leadership Program Certification' as desc1,
    '2013-05-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2010-001'
  AND tc.desc1 = 'Executive Leadership Program Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Strategic Planning Professional for General Manager
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Strategic Planning Training' as training_title,
    'Completed Strategic Planning Professional Certification' as desc1,
    '2015-11-10' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2010-001'
  AND tc.desc1 = 'Strategic Planning Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: Corporate Governance Specialist for General Manager
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Corporate Governance Training' as training_title,
    'Completed Corporate Governance Specialist Certification' as desc1,
    '2017-09-25' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2010-001'
  AND tc.desc1 = 'Corporate Governance Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 5: Business Administration Professional for General Manager
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Business Administration Training' as training_title,
    'Completed Business Administration Professional Certification' as desc1,
    '2019-04-18' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2010-001'
  AND tc.desc1 = 'Business Administration Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Administration Supervisor: Jennifer Lopez
-- Employee ID: (Get from query above, example: 35)
-- ============================================

-- Training 1: Certified Administrative Professional for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'CAP Certification Training' as training_title,
    'Completed Certified Administrative Professional (CAP) certification' as desc1,
    '2022-02-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2021-001'
  AND tc.desc1 = 'Certified Administrative Professional (CAP)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Executive Assistant Certification for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Executive Assistant Training' as training_title,
    'Completed Executive Assistant Certification' as desc1,
    '2022-06-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2021-001'
  AND tc.desc1 = 'Executive Assistant Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Microsoft Office Specialist for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Microsoft Office Specialist Training' as training_title,
    'Completed Microsoft Office Specialist (MOS) certification' as desc1,
    '2022-09-28' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2021-001'
  AND tc.desc1 = 'Microsoft Office Specialist (MOS)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: Business Communication Professional for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Business Communication Training' as training_title,
    'Completed Business Communication Professional Certification' as desc1,
    '2023-01-12' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2021-001'
  AND tc.desc1 = 'Business Communication Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 5: Records Management Specialist for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Records Management Training' as training_title,
    'Completed Records Management Specialist Certification' as desc1,
    '2023-05-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2021-001'
  AND tc.desc1 = 'Records Management Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Administration Supervisor: Christine Garcia
-- Employee ID: (Get from query above, example: 36)
-- ============================================

-- Training 1: Office Management Professional for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Office Management Training' as training_title,
    'Completed Office Management Professional Certification' as desc1,
    '2023-03-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2022-001'
  AND tc.desc1 = 'Office Management Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Microsoft Office Specialist for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Microsoft Office Specialist Training' as training_title,
    'Completed Microsoft Office Specialist (MOS) certification' as desc1,
    '2023-07-22' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2022-001'
  AND tc.desc1 = 'Microsoft Office Specialist (MOS)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Document Management Specialist for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Document Management Training' as training_title,
    'Completed Document Management Specialist Certification' as desc1,
    '2023-10-18' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2022-001'
  AND tc.desc1 = 'Document Management Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: Event Management Professional for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Event Management Training' as training_title,
    'Completed Event Management Professional Certification' as desc1,
    '2023-12-10' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2022-001'
  AND tc.desc1 = 'Event Management Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 5: Business Writing Professional for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Business Writing Training' as training_title,
    'Completed Business Writing Professional Certification' as desc1,
    '2024-01-25' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2022-001'
  AND tc.desc1 = 'Business Writing Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 6: Time Management Professional for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Time Management Training' as training_title,
    'Completed Time Management Professional Certification' as desc1,
    '2024-02-18' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-ADMIN-2022-001'
  AND tc.desc1 = 'Time Management Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Verification Query
-- ============================================
-- Verify all Administration employee trainings
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
WHERE e.department_id = 14
  AND e.deleted_at IS NULL
  AND t.deleted_at IS NULL
ORDER BY e.id_number, t.training_date DESC;

