-- SQL Queries to Insert Training Certificates for Administration Department
-- This file creates training certificates that can be used for Administration employees

-- Training Certificate 1: Project Management Professional (PMP)
INSERT INTO training_certificates (desc1)
VALUES ('Project Management Professional (PMP)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 2: Certified Administrative Professional
INSERT INTO training_certificates (desc1)
VALUES ('Certified Administrative Professional (CAP)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 3: Executive Assistant Certification
INSERT INTO training_certificates (desc1)
VALUES ('Executive Assistant Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 4: Office Management Professional
INSERT INTO training_certificates (desc1)
VALUES ('Office Management Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 5: Business Administration Professional
INSERT INTO training_certificates (desc1)
VALUES ('Business Administration Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 6: Microsoft Office Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Microsoft Office Specialist (MOS)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 7: Records Management Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Records Management Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 8: Business Communication Professional
INSERT INTO training_certificates (desc1)
VALUES ('Business Communication Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 9: Executive Leadership Program
INSERT INTO training_certificates (desc1)
VALUES ('Executive Leadership Program Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 10: Strategic Planning Professional
INSERT INTO training_certificates (desc1)
VALUES ('Strategic Planning Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 11: Corporate Governance Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Corporate Governance Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 12: Event Management Professional
INSERT INTO training_certificates (desc1)
VALUES ('Event Management Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 13: Document Management Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Document Management Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 14: Time Management Professional
INSERT INTO training_certificates (desc1)
VALUES ('Time Management Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 15: Business Writing Professional
INSERT INTO training_certificates (desc1)
VALUES ('Business Writing Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Verify inserted certificates
SELECT id, desc1 FROM training_certificates WHERE deleted_at IS NULL ORDER BY id;

