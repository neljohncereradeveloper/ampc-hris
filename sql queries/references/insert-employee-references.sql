-- SQL Queries to Insert Employee References
-- This file inserts 2-3 references for each employee
-- Uses subqueries to dynamically find employee IDs by id_number

-- ============================================
-- IT Department Employees
-- ============================================

-- References for Ricardo Mendoza (EMP-IT-2012-001) - Department Head
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Carlos', 'Manuel', 'Reyes', '09171234568', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2012-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Maria', 'Cruz', 'Santos', '09182345679', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2012-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Roberto', 'Alvarez', 'Torres', '09193456780', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2012-001' AND e.deleted_at IS NULL;

-- References for Daniel Cruz (EMP-IT-2019-001) - Supervisor
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Eduardo', 'Ramos', 'Cruz', '09204567891', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2019-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Luz', 'Fernandez', 'Garcia', '09215678902', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2019-001' AND e.deleted_at IS NULL;

-- References for Mark Torres (EMP-IT-2021-001) - Full Stack Developer
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Jose', 'Santos', 'Torres', '09226789013', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2021-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Rosa', 'Lopez', 'Alvarez', '09237890124', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2021-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Manuel', 'Villanueva', 'Mendoza', '09248901235', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2021-001' AND e.deleted_at IS NULL;

-- References for Sarah Garcia (EMP-IT-2021-002) - IT Specialist Software
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Roberto', 'Cruz', 'Garcia', '09259012346', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2021-002' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Carmen', 'Reyes', 'Lopez', '09260123457', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2021-002' AND e.deleted_at IS NULL;

-- References for James Fernandez (EMP-IT-2023-001) - IT Specialist Hardware
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Ahmad', 'Torres', 'Fernandez', '09271234568', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2023-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Fatima', 'Santos', 'Villanueva', '09282345679', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2023-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Ricardo', 'Garcia', 'Mendoza', '09293456780', e.id
FROM employees e
WHERE e.id_number = 'EMP-IT-2023-001' AND e.deleted_at IS NULL;

-- ============================================
-- HR Department Employees
-- ============================================

-- References for Elena Reyes (EMP-HR-2004-001) - Department Head
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Roberto', 'Santos', 'Reyes', '09304567891', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2004-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Catherine', 'Cruz', 'Fernandez', '09315678902', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2004-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Manuel', 'Lopez', 'Torres', '09326789013', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2004-001' AND e.deleted_at IS NULL;

-- References for Maria Santos (EMP-HR-2023-001) - Payroll Master
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Jose', 'Garcia', 'Santos', '09337890124', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2023-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Rosa', 'Alvarez', 'Lopez', '09348901235', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2023-001' AND e.deleted_at IS NULL;

-- References for Roberto Garcia (EMP-HR-2019-001) - Supervisor
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Eduardo', 'Ramos', 'Garcia', '09359012346', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2019-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Luz', 'Fernandez', 'Cruz', '09360123457', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2019-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Carlos', 'Villanueva', 'Mendoza', '09371234568', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2019-001' AND e.deleted_at IS NULL;

-- References for Patricia Alvarez (EMP-HR-2023-002) - HR Specialist
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Ricardo', 'Torres', 'Alvarez', '09382345679', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2023-002' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Maria', 'Santos', 'Reyes', '09393456780', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2023-002' AND e.deleted_at IS NULL;

-- References for John Villanueva (EMP-HR-2023-003) - HR Specialist
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Manuel', 'Garcia', 'Villanueva', '09404567891', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2023-003' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Carmen', 'Lopez', 'Fernandez', '09415678902', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2023-003' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Roberto', 'Cruz', 'Torres', '09426789013', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2023-003' AND e.deleted_at IS NULL;

-- References for Michelle Ramos (EMP-HR-2022-001) - HR Specialist
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Eduardo', 'Alvarez', 'Ramos', '09437890124', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2022-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Grace', 'Santos', 'Cruz', '09448901235', e.id
FROM employees e
WHERE e.id_number = 'EMP-HR-2022-001' AND e.deleted_at IS NULL;

-- ============================================
-- Marketing Department Employees
-- ============================================

-- References for Andrea Martinez (EMP-MKT-2015-001) - Department Head
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Michael', 'Fernandez', 'Martinez', '09459012346', e.id
FROM employees e
WHERE e.id_number = 'EMP-MKT-2015-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Roberto', 'Cruz', 'Dela Cruz', '09460123457', e.id
FROM employees e
WHERE e.id_number = 'EMP-MKT-2015-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Catherine', 'Lopez', 'Santos', '09471234568', e.id
FROM employees e
WHERE e.id_number = 'EMP-MKT-2015-001' AND e.deleted_at IS NULL;

-- References for David Tan (EMP-MKT-2020-001) - Supervisor
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Ricardo', 'Lim', 'Tan', '09482345679', e.id
FROM employees e
WHERE e.id_number = 'EMP-MKT-2020-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Maria', 'Wong', 'Lim', '09493456780', e.id
FROM employees e
WHERE e.id_number = 'EMP-MKT-2020-001' AND e.deleted_at IS NULL;

-- References for Sophia Chen (EMP-MKT-2023-001) - Marketing Associate
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Eduardo', 'Wong', 'Chen', '09504567891', e.id
FROM employees e
WHERE e.id_number = 'EMP-MKT-2023-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Grace', 'Tan', 'Wong', '09515678902', e.id
FROM employees e
WHERE e.id_number = 'EMP-MKT-2023-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'James', 'Lim', 'Chen', '09526789013', e.id
FROM employees e
WHERE e.id_number = 'EMP-MKT-2023-001' AND e.deleted_at IS NULL;

-- ============================================
-- Administration Department Employees
-- ============================================

-- References for Roberto Fernandez (EMP-ADMIN-2010-001) - General Manager
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Carlos', 'Santos', 'Fernandez', '09537890124', e.id
FROM employees e
WHERE e.id_number = 'EMP-ADMIN-2010-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Maria', 'Cruz', 'Santos', '09548901235', e.id
FROM employees e
WHERE e.id_number = 'EMP-ADMIN-2010-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Manuel', 'Reyes', 'Torres', '09559012346', e.id
FROM employees e
WHERE e.id_number = 'EMP-ADMIN-2010-001' AND e.deleted_at IS NULL;

-- References for Jennifer Lopez (EMP-ADMIN-2021-001) - Supervisor
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Ricardo', 'Ramos', 'Lopez', '09560123457', e.id
FROM employees e
WHERE e.id_number = 'EMP-ADMIN-2021-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Rosa', 'Garcia', 'Alvarez', '09571234568', e.id
FROM employees e
WHERE e.id_number = 'EMP-ADMIN-2021-001' AND e.deleted_at IS NULL;

-- References for Christine Garcia (EMP-ADMIN-2022-001) - Supervisor
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Eduardo', 'Torres', 'Garcia', '09582345679', e.id
FROM employees e
WHERE e.id_number = 'EMP-ADMIN-2022-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Luz', 'Cruz', 'Torres', '09593456780', e.id
FROM employees e
WHERE e.id_number = 'EMP-ADMIN-2022-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Carlos', 'Villanueva', 'Mendoza', '09604567891', e.id
FROM employees e
WHERE e.id_number = 'EMP-ADMIN-2022-001' AND e.deleted_at IS NULL;

-- ============================================
-- Accounting Department Employees
-- ============================================

-- References for Carmen Villanueva (EMP-ACC-2013-001) - Department Head
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Roberto', 'Mendoza', 'Villanueva', '09615678902', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2013-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Luz', 'Cruz', 'Mendoza', '09626789013', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2013-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Manuel', 'Santos', 'Reyes', '09637890124', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2013-001' AND e.deleted_at IS NULL;

-- References for Michael Torres (EMP-ACC-2018-001) - Supervisor
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Jose', 'Alvarez', 'Torres', '09648901235', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2018-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Rosa', 'Lopez', 'Garcia', '09659012346', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2018-001' AND e.deleted_at IS NULL;

-- References for Patricia Ramos (EMP-ACC-2019-001) - Supervisor
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Carlos', 'Cruz', 'Ramos', '09660123457', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2019-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Grace', 'Fernandez', 'Cruz', '09671234568', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2019-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Eduardo', 'Torres', 'Santos', '09682345679', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2019-001' AND e.deleted_at IS NULL;

-- References for John Santos (EMP-ACC-2022-001) - Accounting Associate
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Manuel', 'Fernandez', 'Santos', '09693456780', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2022-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Carmen', 'Mendoza', 'Villanueva', '09704567891', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2022-001' AND e.deleted_at IS NULL;

-- References for Sarah Garcia (EMP-ACC-2023-001) - Accounting Associate
INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Roberto', 'Lopez', 'Garcia', '09715678902', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2023-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Maria', 'Alvarez', 'Lopez', '09726789013', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2023-001' AND e.deleted_at IS NULL;

INSERT INTO "references" (fname, mname, lname, cellphone_number, employee_id)
SELECT 'Ricardo', 'Cruz', 'Torres', '09737890124', e.id
FROM employees e
WHERE e.id_number = 'EMP-ACC-2023-001' AND e.deleted_at IS NULL;

-- ============================================
-- Verification Query
-- ============================================
-- Verify all employee references
SELECT 
    r.id as reference_id,
    e.id_number,
    e.first_name as employee_first_name,
    e.last_name as employee_last_name,
    (SELECT desc1 FROM departments WHERE id = e.department_id) as department,
    r.fname as reference_first_name,
    r.mname as reference_middle_name,
    r.lname as reference_last_name,
    r.cellphone_number as reference_phone
FROM "references" r
INNER JOIN employees e ON r.employee_id = e.id
WHERE r.deleted_at IS NULL
  AND e.deleted_at IS NULL
ORDER BY e.id_number, r.id;

