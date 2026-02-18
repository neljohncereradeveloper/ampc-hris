-- SQL Queries to Insert Trainings for IT Department Employees
-- This file links IT employees to training certificates
-- Note: Employee IDs and Certificate IDs need to be verified before running

-- Get IT Employee IDs (run this first to get the correct IDs)
-- SELECT id, id_number, first_name, last_name FROM employees WHERE department_id = 10 AND deleted_at IS NULL ORDER BY id;

-- Get Training Certificate IDs (run this first to get the correct IDs)
-- SELECT id, desc1 FROM training_certificates WHERE deleted_at IS NULL ORDER BY id;

-- ============================================
-- IT Department Head: Ricardo Mendoza
-- Employee ID: (Get from query above, example: 16)
-- ============================================

-- Training 1: AWS Certified Solutions Architect for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'AWS Solutions Architecture Training' as training_title,
    'Completed AWS Certified Solutions Architect - Associate certification' as desc1,
    '2020-06-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2012-001'
  AND tc.desc1 = 'AWS Certified Solutions Architect - Associate'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: ITIL Foundation for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'ITIL Foundation Training' as training_title,
    'Completed ITIL Foundation Certification' as desc1,
    '2018-03-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2012-001'
  AND tc.desc1 = 'ITIL Foundation Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: PMP for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Project Management Professional Training' as training_title,
    'Completed Project Management Professional (PMP) certification' as desc1,
    '2019-09-10' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2012-001'
  AND tc.desc1 = 'Project Management Professional (PMP)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- IT Supervisor: Daniel Cruz
-- Employee ID: (Get from query above, example: 17)
-- ============================================

-- Training 1: Microsoft Azure Administrator for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Microsoft Azure Administrator Training' as training_title,
    'Completed Microsoft Azure Administrator Associate certification' as desc1,
    '2021-05-12' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2019-001'
  AND tc.desc1 = 'Microsoft Azure Administrator Associate'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: CompTIA Security+ for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'CompTIA Security+ Training' as training_title,
    'Completed CompTIA Security+ certification' as desc1,
    '2020-11-08' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2019-001'
  AND tc.desc1 = 'CompTIA Security+'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Full Stack Developer: Mark Torres
-- Employee ID: (Get from query above, example: 18)
-- ============================================

-- Training 1: AWS Certified Developer for Full Stack Developer
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'AWS Developer Training' as training_title,
    'Completed AWS Certified Developer - Associate certification' as desc1,
    '2022-08-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2021-001'
  AND tc.desc1 = 'AWS Certified Developer - Associate'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Docker Certified Associate for Full Stack Developer
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Docker Training' as training_title,
    'Completed Docker Certified Associate (DCA) certification' as desc1,
    '2022-03-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2021-001'
  AND tc.desc1 = 'Docker Certified Associate (DCA)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Certified Kubernetes Administrator for Full Stack Developer
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Kubernetes Administrator Training' as training_title,
    'Completed Certified Kubernetes Administrator (CKA) certification' as desc1,
    '2023-01-10' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2021-001'
  AND tc.desc1 = 'Certified Kubernetes Administrator (CKA)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- IT Specialist Software: Sarah Garcia
-- Employee ID: (Get from query above, example: 19)
-- ============================================

-- Training 1: Microsoft Azure Developer for IT Specialist Software
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Microsoft Azure Developer Training' as training_title,
    'Completed Microsoft Azure Developer Associate certification' as desc1,
    '2022-09-25' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2021-002'
  AND tc.desc1 = 'Microsoft Azure Developer Associate'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Google Cloud Professional for IT Specialist Software
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Google Cloud Architect Training' as training_title,
    'Completed Google Cloud Professional Cloud Architect certification' as desc1,
    '2023-04-18' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2021-002'
  AND tc.desc1 = 'Google Cloud Professional Cloud Architect'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- IT Specialist Hardware: James Fernandez
-- Employee ID: (Get from query above, example: 20)
-- ============================================

-- Training 1: Cisco CCNA for IT Specialist Hardware
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Cisco CCNA Training' as training_title,
    'Completed Cisco Certified Network Associate (CCNA) certification' as desc1,
    '2023-11-05' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2023-001'
  AND tc.desc1 = 'Cisco Certified Network Associate (CCNA)'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: CompTIA Security+ for IT Specialist Hardware
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'CompTIA Security+ Training' as training_title,
    'Completed CompTIA Security+ certification' as desc1,
    '2024-01-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-IT-2023-001'
  AND tc.desc1 = 'CompTIA Security+'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Verification Query
-- ============================================
-- Verify all IT employee trainings
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
WHERE e.department_id = 10
  AND e.deleted_at IS NULL
  AND t.deleted_at IS NULL
ORDER BY e.id_number, t.training_date DESC;

