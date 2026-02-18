-- SQL Queries to Insert Training Certificates for IT Department
-- This file creates training certificates that can be used for IT employees

-- Training Certificate 1: AWS Certified Solutions Architect
INSERT INTO training_certificates (desc1)
VALUES ('AWS Certified Solutions Architect - Associate')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 2: Microsoft Azure Administrator
INSERT INTO training_certificates (desc1)
VALUES ('Microsoft Azure Administrator Associate')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 3: Google Cloud Professional
INSERT INTO training_certificates (desc1)
VALUES ('Google Cloud Professional Cloud Architect')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 4: Certified Kubernetes Administrator
INSERT INTO training_certificates (desc1)
VALUES ('Certified Kubernetes Administrator (CKA)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 5: CompTIA Security+
INSERT INTO training_certificates (desc1)
VALUES ('CompTIA Security+')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 6: Cisco CCNA
INSERT INTO training_certificates (desc1)
VALUES ('Cisco Certified Network Associate (CCNA)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 7: AWS Certified Developer
INSERT INTO training_certificates (desc1)
VALUES ('AWS Certified Developer - Associate')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 8: Microsoft Azure Developer
INSERT INTO training_certificates (desc1)
VALUES ('Microsoft Azure Developer Associate')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 9: Docker Certified Associate
INSERT INTO training_certificates (desc1)
VALUES ('Docker Certified Associate (DCA)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 10: ITIL Foundation
INSERT INTO training_certificates (desc1)
VALUES ('ITIL Foundation Certification')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 11: Project Management Professional
INSERT INTO training_certificates (desc1)
VALUES ('Project Management Professional (PMP)')
ON CONFLICT (desc1) DO NOTHING;

-- Training Certificate 12: Certified Information Systems Security Professional
INSERT INTO training_certificates (desc1)
VALUES ('Certified Information Systems Security Professional (CISSP)')
ON CONFLICT (desc1) DO NOTHING;

-- Verify inserted certificates
SELECT id, desc1 FROM training_certificates WHERE deleted_at IS NULL ORDER BY id;

