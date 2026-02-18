-- SQL Queries to Insert Training Certificates for HR Department
-- This file creates training certificates that can be used for HR employees

-- Training Certificate 1: SHRM Certified Professional
INSERT INTO training_certificates (desc1)
VALUES ('SHRM Certified Professional (SHRM-CP)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 2: HRCI Professional in Human Resources
INSERT INTO training_certificates (desc1)
VALUES ('HRCI Professional in Human Resources (PHR)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 3: Certified Payroll Professional
INSERT INTO training_certificates (desc1)
VALUES ('Certified Payroll Professional (CPP)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 4: Philippine Labor Law Compliance
INSERT INTO training_certificates (desc1)
VALUES ('Philippine Labor Law Compliance Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 5: DOLE Compliance Specialist
INSERT INTO training_certificates (desc1)
VALUES ('DOLE Compliance Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 6: Recruitment and Selection Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Recruitment and Selection Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 7: Performance Management Professional
INSERT INTO training_certificates (desc1)
VALUES ('Performance Management Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 8: Compensation and Benefits Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Compensation and Benefits Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 9: Employee Relations Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Employee Relations Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 10: Training and Development Professional
INSERT INTO training_certificates (desc1)
VALUES ('Training and Development Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 11: HR Analytics Professional
INSERT INTO training_certificates (desc1)
VALUES ('HR Analytics Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 12: Strategic Human Resource Management
INSERT INTO training_certificates (desc1)
VALUES ('Strategic Human Resource Management Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 13: Talent Acquisition Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Talent Acquisition Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 14: Organizational Development Professional
INSERT INTO training_certificates (desc1)
VALUES ('Organizational Development Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Verify inserted certificates
SELECT id, desc1 FROM training_certificates WHERE deleted_at IS NULL ORDER BY id;

