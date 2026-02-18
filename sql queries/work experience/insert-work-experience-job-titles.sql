-- SQL Queries to Insert Work Experience Job Titles
-- This file creates work experience job titles that can be used for employee work experiences

-- IT/Tech Job Titles
INSERT INTO work_experience_job_titles (desc1)
VALUES ('Software Developer')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Junior Software Developer')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Senior Software Developer')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Web Developer')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Frontend Developer')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Backend Developer')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Full Stack Developer')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('IT Support Specialist')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Network Administrator')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('System Administrator')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Database Administrator')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('IT Project Manager')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Software Engineer')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('DevOps Engineer')
ON CONFLICT (desc1) DO NOTHING;

-- HR Job Titles
INSERT INTO work_experience_job_titles (desc1)
VALUES ('HR Assistant')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('HR Coordinator')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Recruitment Specialist')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Payroll Assistant')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('HR Generalist')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Compensation and Benefits Specialist')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Training Coordinator')
ON CONFLICT (desc1) DO NOTHING;

-- Marketing Job Titles
INSERT INTO work_experience_job_titles (desc1)
VALUES ('Marketing Assistant')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Marketing Coordinator')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Digital Marketing Specialist')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Social Media Specialist')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Content Writer')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Brand Manager')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Marketing Manager')
ON CONFLICT (desc1) DO NOTHING;

-- Accounting Job Titles
INSERT INTO work_experience_job_titles (desc1)
VALUES ('Accounting Assistant')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Junior Accountant')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Staff Accountant')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Senior Accountant')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Bookkeeper')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Accounts Payable Clerk')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Accounts Receivable Clerk')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Tax Accountant')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Internal Auditor')
ON CONFLICT (desc1) DO NOTHING;

-- Administration Job Titles
INSERT INTO work_experience_job_titles (desc1)
VALUES ('Administrative Assistant')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Executive Assistant')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Office Clerk')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Data Entry Clerk')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Receptionist')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Office Manager')
ON CONFLICT (desc1) DO NOTHING;

-- Management Job Titles
INSERT INTO work_experience_job_titles (desc1)
VALUES ('Department Manager')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Operations Manager')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_job_titles (desc1)
VALUES ('Business Manager')
ON CONFLICT (desc1) DO NOTHING;

-- Verify inserted job titles
SELECT id, desc1 FROM work_experience_job_titles WHERE deleted_at IS NULL ORDER BY id;

