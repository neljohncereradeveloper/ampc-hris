-- SQL Queries to Insert Education Records for Employees
-- This file links employees to education records (schools, levels, courses, and course levels)
-- Note: Employee IDs, School IDs, Level IDs, Course IDs, and Course Level IDs need to be verified before running

-- Get Employee IDs (run this first to get the correct IDs)
-- SELECT id, id_number, first_name, last_name FROM employees WHERE deleted_at IS NULL ORDER BY id;

-- Get School IDs (run this first to get the correct IDs)
-- SELECT id, desc1 FROM education_schools WHERE deleted_at IS NULL ORDER BY id;

-- Get Level IDs (run this first to get the correct IDs)
-- SELECT id, desc1 FROM education_levels WHERE deleted_at IS NULL ORDER BY id;

-- Get Course IDs (run this first to get the correct IDs)
-- SELECT id, desc1 FROM education_courses WHERE deleted_at IS NULL ORDER BY id;

-- Get Course Level IDs (run this first to get the correct IDs)
-- SELECT id, desc1 FROM education_course_levels WHERE deleted_at IS NULL ORDER BY id;

-- ============================================
-- IT Department Employees
-- ============================================

-- Education 1 for Ricardo Mendoza (EMP-IT-2012-001) - Department Head - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2004-2008' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-IT-2012-001'
  AND s.desc1 = 'University of the Philippines'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Computer Science'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Ricardo Mendoza - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2002-2004' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-IT-2012-001'
  AND s.desc1 = 'University of the Philippines'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Daniel Cruz (EMP-IT-2019-001) - Supervisor - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2011-2015' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-IT-2019-001'
  AND s.desc1 = 'Ateneo de Manila University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Information Technology'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Daniel Cruz - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2009-2011' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-IT-2019-001'
  AND s.desc1 = 'Ateneo de Manila University'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Mark Torres (EMP-IT-2021-001) - Full Stack Developer - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2014-2018' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-IT-2021-001'
  AND s.desc1 = 'De La Salle University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Computer Science'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Mark Torres - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2012-2014' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-IT-2021-001'
  AND s.desc1 = 'De La Salle University'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Sarah Garcia (EMP-IT-2021-002) - IT Specialist Software - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2015-2019' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-IT-2021-002'
  AND s.desc1 = 'University of Santo Tomas'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Information Systems'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Sarah Garcia - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2013-2015' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-IT-2021-002'
  AND s.desc1 = 'University of Santo Tomas'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for James Fernandez (EMP-IT-2023-001) - IT Specialist Hardware - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2016-2020' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-IT-2023-001'
  AND s.desc1 = 'Mapúa University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Computer Engineering'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for James Fernandez - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2014-2016' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-IT-2023-001'
  AND s.desc1 = 'Mapúa University'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- ============================================
-- HR Department Employees
-- ============================================

-- Education 1 for Elena Reyes (EMP-HR-2004-001) - Department Head - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '1996-2000' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-HR-2004-001'
  AND s.desc1 = 'University of the Philippines'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Psychology'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Elena Reyes - Master's Degree
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    '2001-2003' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
WHERE e.id_number = 'EMP-HR-2004-001'
  AND s.desc1 = 'Ateneo de Manila University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Master of Business Administration'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL;

-- Education 3 for Elena Reyes - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '1994-1996' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-HR-2004-001'
  AND s.desc1 = 'University of the Philippines'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Maria Santos (EMP-HR-2023-001) - Payroll Master - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2009-2013' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-HR-2023-001'
  AND s.desc1 = 'De La Salle University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Business Administration'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Maria Santos - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2007-2009' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-HR-2023-001'
  AND s.desc1 = 'De La Salle University'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Roberto Garcia (EMP-HR-2019-001) - Supervisor - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2012-2016' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-HR-2019-001'
  AND s.desc1 = 'University of Santo Tomas'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Human Resource Management'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Roberto Garcia - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2010-2012' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-HR-2019-001'
  AND s.desc1 = 'University of Santo Tomas'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Patricia Alvarez (EMP-HR-2023-002) - HR Specialist - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2016-2020' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-HR-2023-002'
  AND s.desc1 = 'University of the East'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Psychology'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Patricia Alvarez - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2014-2016' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-HR-2023-002'
  AND s.desc1 = 'University of the East'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for John Villanueva (EMP-HR-2023-003) - HR Specialist - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2017-2021' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-HR-2023-003'
  AND s.desc1 = 'Far Eastern University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Business Administration'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for John Villanueva - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2015-2017' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-HR-2023-003'
  AND s.desc1 = 'Far Eastern University'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Michelle Ramos (EMP-HR-2022-001) - HR Specialist - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2016-2020' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-HR-2022-001'
  AND s.desc1 = 'Polytechnic University of the Philippines'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Human Resource Management'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Michelle Ramos - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2014-2016' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-HR-2022-001'
  AND s.desc1 = 'Polytechnic University of the Philippines'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- ============================================
-- Marketing Department Employees
-- ============================================

-- Education 1 for Andrea Martinez (EMP-MKT-2015-001) - Department Head - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '1998-2002' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-MKT-2015-001'
  AND s.desc1 = 'Ateneo de Manila University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Marketing Management'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Andrea Martinez - Master's Degree
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    '2003-2005' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
WHERE e.id_number = 'EMP-MKT-2015-001'
  AND s.desc1 = 'De La Salle University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Master of Business Administration'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL;

-- Education 3 for Andrea Martinez - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '1996-1998' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-MKT-2015-001'
  AND s.desc1 = 'Ateneo de Manila University'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for David Tan (EMP-MKT-2020-001) - Supervisor - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2013-2017' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-MKT-2020-001'
  AND s.desc1 = 'University of Santo Tomas'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Marketing'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for David Tan - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2011-2013' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-MKT-2020-001'
  AND s.desc1 = 'University of Santo Tomas'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Sophia Chen (EMP-MKT-2023-001) - Marketing Associate - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2017-2021' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-MKT-2023-001'
  AND s.desc1 = 'De La Salle - College of Saint Benilde'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Arts in Communication'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Sophia Chen - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2015-2017' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-MKT-2023-001'
  AND s.desc1 = 'De La Salle - College of Saint Benilde'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- ============================================
-- Administration Department Employees
-- ============================================

-- Education 1 for Roberto Fernandez (EMP-ADMIN-2010-001) - General Manager - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '1992-1996' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-ADMIN-2010-001'
  AND s.desc1 = 'University of the Philippines'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Business Administration'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Roberto Fernandez - Master's Degree
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    '1997-1999' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
WHERE e.id_number = 'EMP-ADMIN-2010-001'
  AND s.desc1 = 'Ateneo de Manila University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Master of Business Administration'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL;

-- Education 3 for Roberto Fernandez - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '1990-1992' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-ADMIN-2010-001'
  AND s.desc1 = 'University of the Philippines'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Jennifer Lopez (EMP-ADMIN-2021-001) - Supervisor - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2013-2017' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-ADMIN-2021-001'
  AND s.desc1 = 'University of the East'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Office Administration'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Jennifer Lopez - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2011-2013' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-ADMIN-2021-001'
  AND s.desc1 = 'University of the East'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Christine Garcia (EMP-ADMIN-2022-001) - Supervisor - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2015-2019' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-ADMIN-2022-001'
  AND s.desc1 = 'Polytechnic University of the Philippines'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Arts in English'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Christine Garcia - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2013-2015' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-ADMIN-2022-001'
  AND s.desc1 = 'Polytechnic University of the Philippines'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- ============================================
-- Accounting Department Employees
-- ============================================

-- Education 1 for Carmen Villanueva (EMP-ACC-2013-001) - Department Head - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '1998-2002' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-ACC-2013-001'
  AND s.desc1 = 'University of Santo Tomas'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Accountancy'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Carmen Villanueva - Master's Degree
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    '2003-2005' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
WHERE e.id_number = 'EMP-ACC-2013-001'
  AND s.desc1 = 'De La Salle University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Master of Science in Accountancy'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL;

-- Education 3 for Carmen Villanueva - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '1996-1998' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-ACC-2013-001'
  AND s.desc1 = 'University of Santo Tomas'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Michael Torres (EMP-ACC-2018-001) - Supervisor - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2011-2015' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-ACC-2018-001'
  AND s.desc1 = 'De La Salle University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Accountancy'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Michael Torres - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2009-2011' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-ACC-2018-001'
  AND s.desc1 = 'De La Salle University'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Patricia Ramos (EMP-ACC-2019-001) - Supervisor - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2012-2016' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-ACC-2019-001'
  AND s.desc1 = 'University of the Philippines'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Accountancy'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Patricia Ramos - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2010-2012' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-ACC-2019-001'
  AND s.desc1 = 'University of the Philippines'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for John Santos (EMP-ACC-2022-001) - Accounting Associate - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2016-2020' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-ACC-2022-001'
  AND s.desc1 = 'University of the East'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Accounting Technology'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for John Santos - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2014-2016' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-ACC-2022-001'
  AND s.desc1 = 'University of the East'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- Education 1 for Sarah Garcia (EMP-ACC-2023-001) - Accounting Associate - College
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    education_course_id,
    education_course_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    c.id as education_course_id,
    cl.id as education_course_level_id,
    '2017-2021' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
CROSS JOIN education_courses c
CROSS JOIN education_course_levels cl
WHERE e.id_number = 'EMP-ACC-2023-001'
  AND s.desc1 = 'Far Eastern University'
  AND l.desc1 = 'college'
  AND c.desc1 = 'Bachelor of Science in Accounting'
  AND cl.desc1 = 'Fourth Year'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND cl.deleted_at IS NULL;

-- Education 2 for Sarah Garcia - Senior High School
INSERT INTO educations (
    employee_id,
    education_school_id,
    education_level_id,
    school_year
)
SELECT 
    e.id as employee_id,
    s.id as education_school_id,
    l.id as education_level_id,
    '2015-2017' as school_year
FROM employees e
CROSS JOIN education_schools s
CROSS JOIN education_levels l
WHERE e.id_number = 'EMP-ACC-2023-001'
  AND s.desc1 = 'Far Eastern University'
  AND l.desc1 = 'senior high school'
  AND e.deleted_at IS NULL
  AND s.deleted_at IS NULL
  AND l.deleted_at IS NULL;

-- ============================================
-- Verification Query
-- ============================================
-- Verify all employee education records
SELECT 
    ed.id as education_id,
    e.id_number,
    e.first_name,
    e.last_name,
    (SELECT desc1 FROM departments WHERE id = e.department_id) as department,
    s.desc1 as school_name,
    l.desc1 as education_level,
    c.desc1 as course_name,
    cl.desc1 as course_level,
    ed.school_year
FROM educations ed
INNER JOIN employees e ON ed.employee_id = e.id
INNER JOIN education_schools s ON ed.education_school_id = s.id
INNER JOIN education_levels l ON ed.education_level_id = l.id
LEFT JOIN education_courses c ON ed.education_course_id = c.id
LEFT JOIN education_course_levels cl ON ed.education_course_level_id = cl.id
WHERE ed.deleted_at IS NULL
  AND e.deleted_at IS NULL
ORDER BY e.id_number, ed.school_year DESC;

