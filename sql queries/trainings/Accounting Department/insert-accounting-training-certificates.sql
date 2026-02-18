-- SQL Queries to Insert Training Certificates for Accounting Department
-- This file creates training certificates that can be used for Accounting employees

-- Training Certificate 1: Certified Public Accountant (CPA)
INSERT INTO training_certificates (desc1)
VALUES ('Certified Public Accountant (CPA)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 2: Certified Management Accountant (CMA)
INSERT INTO training_certificates (desc1)
VALUES ('Certified Management Accountant (CMA)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 3: Certified Internal Auditor (CIA)
INSERT INTO training_certificates (desc1)
VALUES ('Certified Internal Auditor (CIA)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 4: QuickBooks Certified User
INSERT INTO training_certificates (desc1)
VALUES ('QuickBooks Certified User')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 5: Xero Certified Advisor
INSERT INTO training_certificates (desc1)
VALUES ('Xero Certified Advisor')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 6: Financial Accounting Professional
INSERT INTO training_certificates (desc1)
VALUES ('Financial Accounting Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 7: Tax Preparation Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Tax Preparation Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 8: BIR Tax Compliance Specialist
INSERT INTO training_certificates (desc1)
VALUES ('BIR Tax Compliance Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 9: Financial Statement Analysis Professional
INSERT INTO training_certificates (desc1)
VALUES ('Financial Statement Analysis Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 10: Accounts Payable Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Accounts Payable Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 11: Accounts Receivable Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Accounts Receivable Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 12: Bookkeeping Professional
INSERT INTO training_certificates (desc1)
VALUES ('Bookkeeping Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 13: Cost Accounting Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Cost Accounting Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 14: Audit and Assurance Professional
INSERT INTO training_certificates (desc1)
VALUES ('Audit and Assurance Professional Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 15: Financial Reporting Specialist
INSERT INTO training_certificates (desc1)
VALUES ('Financial Reporting Specialist Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Verify inserted certificates
SELECT id, desc1 FROM training_certificates WHERE deleted_at IS NULL ORDER BY id;

