-- SQL Queries to Insert Work Experience Companies (Philippine Companies)
-- This file creates work experience companies that can be used for employee work experiences

-- IT/Tech Companies
INSERT INTO work_experience_companies (desc1)
VALUES ('Accenture Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('IBM Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Cognizant Technology Solutions Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('DXC Technology Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('PLDT Inc.')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Globe Telecom')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Pointwest Technologies')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Orange & Bronze Software Labs')
ON CONFLICT (desc1) DO NOTHING;

-- Banking and Financial Services
INSERT INTO work_experience_companies (desc1)
VALUES ('BDO Unibank, Inc.')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Bank of the Philippine Islands (BPI)')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Metrobank')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Security Bank Corporation')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('RCBC (Rizal Commercial Banking Corporation)')
ON CONFLICT (desc1) DO NOTHING;

-- Conglomerates and Large Corporations
INSERT INTO work_experience_companies (desc1)
VALUES ('Ayala Corporation')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('SM Investments Corporation')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('San Miguel Corporation')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('JG Summit Holdings, Inc.')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Aboitiz Equity Ventures, Inc.')
ON CONFLICT (desc1) DO NOTHING;

-- HR and BPO Companies
INSERT INTO work_experience_companies (desc1)
VALUES ('Concentrix Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Teleperformance Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('TaskUs Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Sitel Philippines')
ON CONFLICT (desc1) DO NOTHING;

-- Marketing and Advertising
INSERT INTO work_experience_companies (desc1)
VALUES ('Ogilvy Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Dentsu Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('McCann Worldgroup Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('BBDO Guerrero Philippines')
ON CONFLICT (desc1) DO NOTHING;

-- Accounting and Professional Services
INSERT INTO work_experience_companies (desc1)
VALUES ('SGV & Co. (SyCip Gorres Velayo & Co.)')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('PwC Philippines (PricewaterhouseCoopers)')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Deloitte Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('KPMG Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Ernst & Young Philippines')
ON CONFLICT (desc1) DO NOTHING;

-- Retail and Consumer Goods
INSERT INTO work_experience_companies (desc1)
VALUES ('Jollibee Foods Corporation')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Universal Robina Corporation (URC)')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Puregold Price Club Inc.')
ON CONFLICT (desc1) DO NOTHING;

-- Utilities and Energy
INSERT INTO work_experience_companies (desc1)
VALUES ('Manila Electric Company (Meralco)')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('Aboitiz Power Corporation')
ON CONFLICT (desc1) DO NOTHING;

-- Real Estate
INSERT INTO work_experience_companies (desc1)
VALUES ('Ayala Land, Inc.')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO work_experience_companies (desc1)
VALUES ('SM Prime Holdings, Inc.')
ON CONFLICT (desc1) DO NOTHING;

-- Verify inserted companies
SELECT id, desc1 FROM work_experience_companies WHERE deleted_at IS NULL ORDER BY id;

