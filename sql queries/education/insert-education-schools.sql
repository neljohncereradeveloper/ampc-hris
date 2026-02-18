-- SQL Queries to Insert Education Schools (Philippine Universities and Colleges)
-- This file creates education schools that can be used for employee education records

-- Top Universities
INSERT INTO education_schools (desc1)
VALUES ('University of the Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Ateneo de Manila University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('De La Salle University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('University of Santo Tomas')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Mapúa University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('University of the East')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Far Eastern University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Adamson University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Polytechnic University of the Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('University of San Carlos')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Ateneo de Davao University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Xavier University - Ateneo de Cagayan')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Mindanao State University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Central Mindanao University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('University of Mindanao')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Ateneo de Naga University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Saint Louis University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Silliman University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('University of San Jose - Recoletos')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('De La Salle - College of Saint Benilde')
ON CONFLICT (desc1) DO NOTHING;

-- Technical and State Universities
INSERT INTO education_schools (desc1)
VALUES ('Technological Institute of the Philippines')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('AMA Computer University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('STI College')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('National University')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_schools (desc1)
VALUES ('Lyceum of the Philippines University')
ON CONFLICT (desc1) DO NOTHING;

-- Verify inserted schools
SELECT id, desc1 FROM education_schools WHERE deleted_at IS NULL ORDER BY id;

