-- SQL Queries to Insert Trainings for Marketing Department Employees
-- This file links Marketing employees to training certificates
-- Note: Employee IDs and Certificate IDs need to be verified before running

-- Get Marketing Employee IDs (run this first to get the correct IDs)
-- SELECT id, id_number, first_name, last_name FROM employees WHERE department_id = 13 AND deleted_at IS NULL ORDER BY id;

-- Get Training Certificate IDs (run this first to get the correct IDs)
-- SELECT id, desc1 FROM training_certificates WHERE deleted_at IS NULL ORDER BY id;

-- ============================================
-- Marketing Department Head: Andrea Martinez
-- Employee ID: (Get from query above, example: 31)
-- ============================================

-- Training 1: Strategic Marketing Management for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Strategic Marketing Management Training' as training_title,
    'Completed Strategic Marketing Management Certification' as desc1,
    '2016-09-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2015-001'
  AND tc.desc1 = 'Strategic Marketing Management Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Brand Management Specialist for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Brand Management Training' as training_title,
    'Completed Brand Management Specialist Certification' as desc1,
    '2017-04-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2015-001'
  AND tc.desc1 = 'Brand Management Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Marketing Analytics Professional for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Marketing Analytics Training' as training_title,
    'Completed Marketing Analytics Professional Certification' as desc1,
    '2018-11-10' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2015-001'
  AND tc.desc1 = 'Marketing Analytics Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: Market Research Analyst for Department Head
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Market Research Training' as training_title,
    'Completed Market Research Analyst Certification' as desc1,
    '2019-06-25' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2015-001'
  AND tc.desc1 = 'Market Research Analyst Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Marketing Supervisor: David Tan
-- Employee ID: (Get from query above, example: 32)
-- ============================================

-- Training 1: Digital Marketing Professional for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Digital Marketing Training' as training_title,
    'Completed Digital Marketing Professional Certification' as desc1,
    '2021-03-18' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2020-001'
  AND tc.desc1 = 'Digital Marketing Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: Google Analytics Certified for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Google Analytics Training' as training_title,
    'Completed Google Analytics Certified certification' as desc1,
    '2021-08-22' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2020-001'
  AND tc.desc1 = 'Google Analytics Certified'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Google Ads Certified for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Google Ads Training' as training_title,
    'Completed Google Ads Certified certification' as desc1,
    '2022-01-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2020-001'
  AND tc.desc1 = 'Google Ads Certified'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: SEO Specialist for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'SEO Specialist Training' as training_title,
    'Completed Search Engine Optimization (SEO) Specialist Certification' as desc1,
    '2022-05-30' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2020-001'
  AND tc.desc1 = 'Search Engine Optimization (SEO) Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 5: Social Media Marketing Specialist for Supervisor
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Social Media Marketing Training' as training_title,
    'Completed Social Media Marketing Specialist Certification' as desc1,
    '2022-10-12' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2020-001'
  AND tc.desc1 = 'Social Media Marketing Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Marketing Associate: Sophia Chen
-- Employee ID: (Get from query above, example: 33)
-- ============================================

-- Training 1: Facebook Blueprint Certified for Marketing Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Facebook Blueprint Training' as training_title,
    'Completed Facebook Blueprint Certified certification' as desc1,
    '2023-04-20' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2023-001'
  AND tc.desc1 = 'Facebook Blueprint Certified'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 2: HubSpot Content Marketing Certified for Marketing Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'HubSpot Content Marketing Training' as training_title,
    'Completed HubSpot Content Marketing Certified certification' as desc1,
    '2023-07-15' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2023-001'
  AND tc.desc1 = 'HubSpot Content Marketing Certified'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 3: Content Marketing Professional for Marketing Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Content Marketing Training' as training_title,
    'Completed Content Marketing Professional Certification' as desc1,
    '2023-09-28' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2023-001'
  AND tc.desc1 = 'Content Marketing Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 4: Email Marketing Professional for Marketing Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'Email Marketing Training' as training_title,
    'Completed Email Marketing Professional Certification' as desc1,
    '2023-11-10' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2023-001'
  AND tc.desc1 = 'Email Marketing Professional Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- Training 5: CRM Specialist for Marketing Associate
INSERT INTO trainings (
    employee_id,
    training_title,
    desc1,
    training_date,
    trainings_cert_id
) 
SELECT 
    e.id as employee_id,
    'CRM Specialist Training' as training_title,
    'Completed Customer Relationship Management (CRM) Specialist Certification' as desc1,
    '2024-01-18' as training_date,
    tc.id as trainings_cert_id
FROM employees e
CROSS JOIN training_certificates tc
WHERE e.id_number = 'EMP-MKT-2023-001'
  AND tc.desc1 = 'Customer Relationship Management (CRM) Specialist Certification'
  AND e.deleted_at IS NULL
  AND tc.deleted_at IS NULL;

-- ============================================
-- Verification Query
-- ============================================
-- Verify all Marketing employee trainings
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
WHERE e.department_id = 13
  AND e.deleted_at IS NULL
  AND t.deleted_at IS NULL
ORDER BY e.id_number, t.training_date DESC;

