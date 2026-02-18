-- SQL Queries to Insert Education Course Levels
-- This file creates education course levels that can be used for employee education records

-- Course Levels
INSERT INTO education_course_levels (desc1)
VALUES ('First Year')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_course_levels (desc1)
VALUES ('Second Year')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_course_levels (desc1)
VALUES ('Third Year')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_course_levels (desc1)
VALUES ('Fourth Year')
ON CONFLICT (desc1) DO NOTHING;

INSERT INTO education_course_levels (desc1)
VALUES ('Graduate')
ON CONFLICT (desc1) DO NOTHING;

-- Verify inserted course levels
SELECT id, desc1 FROM education_course_levels WHERE deleted_at IS NULL ORDER BY id;

