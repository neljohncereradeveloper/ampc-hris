-- SQL Queries to Insert Education Courses
-- This file creates education courses that can be used for employee education records

-- IT/Computer Science Courses
INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Computer Science')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Information Technology')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Information Systems')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Software Engineering')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Computer Engineering')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Master of Science in Computer Science')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Master of Science in Information Technology')
ON CONFLICT (desc1) DO NOTHING;

-- Business and Management Courses
INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Business Administration')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Business Management')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Master of Business Administration')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Master in Business Administration')
ON CONFLICT (desc1) DO NOTHING;

-- Accounting and Finance Courses
INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Accountancy')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Accounting')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Accounting Technology')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Finance')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Master of Science in Accountancy')
ON CONFLICT (desc1) DO NOTHING;

-- Marketing Courses
INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Marketing')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Marketing Management')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Entrepreneurship')
ON CONFLICT (desc1) DO NOTHING;

-- HR and Psychology Courses
INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Psychology')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Human Resource Management')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Master of Arts in Psychology')
ON CONFLICT (desc1) DO NOTHING;

-- General Education Courses
INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Arts in Communication')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Arts in English')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_courses (desc1)
VALUES ('Bachelor of Science in Office Administration')
ON CONFLICT (desc1) DO NOTHING;

-- Verify inserted courses
SELECT id, desc1 FROM education_courses WHERE deleted_at IS NULL ORDER BY id;

