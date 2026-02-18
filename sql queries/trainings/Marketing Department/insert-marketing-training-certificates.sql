-- SQL Queries to Insert Training Certificates for Marketing Department
-- This file creates training certificates that can be used for Marketing employees

-- Training Certificate 1: Google Analytics Certified
INSERT INTO training_certificates (desc1)
VALUES ('Google Analytics Certified')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 2: Google Ads Certified
INSERT INTO training_certificates (desc1)
VALUES ('Google Ads Certified')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 3: Facebook Blueprint Certified
INSERT INTO training_certificates (desc1)
VALUES ('Facebook Blueprint Certified')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 4: HubSpot Content Marketing Certified
INSERT INTO training_certificates (desc1)
VALUES ('HubSpot Content Marketing Certified')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 5: Digital Marketing Professional
INSERT INTO training_certificates (desc1)
VALUES ('Digital Marketing Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 6: Social Media Marketing Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Social Media Marketing Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 7: Search Engine Optimization (SEO) Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Search Engine Optimization (SEO) Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 8: Email Marketing Professional
INSERT INTO training_certificates (desc1)
VALUES ('Email Marketing Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 9: Content Marketing Professional
INSERT INTO training_certificates (desc1)
VALUES ('Content Marketing Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 10: Brand Management Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Brand Management Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 11: Marketing Analytics Professional
INSERT INTO training_certificates (desc1)
VALUES ('Marketing Analytics Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 12: Strategic Marketing Management
INSERT INTO training_certificates (desc1)
VALUES ('Strategic Marketing Management Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 13: Market Research Analyst
INSERT INTO training_certificates (desc1)
VALUES ('Market Research Analyst Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 14: Customer Relationship Management (CRM) Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Customer Relationship Management (CRM) Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 15: Marketing Automation Professional
INSERT INTO training_certificates (desc1)
VALUES ('Marketing Automation Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Verify inserted certificates
SELECT id, desc1 FROM training_certificates WHERE deleted_at IS NULL ORDER BY id;

