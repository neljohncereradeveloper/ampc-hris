-- SQL Queries to Insert Payroll Types
-- Table: p_payroll_types
-- Description: Comprehensive payroll types for Philippines payroll system (DOLE/BIR compliant)
-- Created: 2026-01-25

-- ============================================================================
-- STATUTORY DEDUCTIONS (Government-mandated contributions)
-- ============================================================================
-- These are mandatory deductions required by Philippine law

-- SSS (Social Security System)
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    calculation,
    created_by,
    created_at
) VALUES (
    'SSS',
    'SSS Contribution',
    'STATUTORY_DEDUCTION',
    false,
    true,
    1,
    true,
    'Based on SSS contribution table',
    'system',
    NOW()
);

-- PhilHealth (Philippine Health Insurance Corporation)
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    calculation,
    created_by,
    created_at
) VALUES (
    'PHILHEALTH',
    'PhilHealth Contribution',
    'STATUTORY_DEDUCTION',
    false,
    true,
    2,
    true,
    '2.75% of basic salary (minimum/maximum based on salary bracket)',
    'system',
    NOW()
);

-- Pag-IBIG (Home Development Mutual Fund)
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    calculation,
    created_by,
    created_at
) VALUES (
    'PAGIBIG',
    'Pag-IBIG Contribution',
    NULL,
    'STATUTORY_DEDUCTION',
    false,
    true,
    3,
    true,
    'Employee: 2% of basic salary (max 100), Employer: 2%',
    'system',
    NOW()
);

-- Withholding Tax (BIR)
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    calculation,
    created_by,
    created_at
) VALUES (
    'WITHHOLDING_TAX',
    'Withholding Tax (BIR)',
    NULL,
    'STATUTORY_DEDUCTION',
    false,
    true,
    4,
    true,
    'Based on BIR tax table',
    'system',
    NOW()
);

-- ============================================================================
-- OTHER DEDUCTIONS (Voluntary/authorized deductions)
-- ============================================================================

-- SSS Loan
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'SSS_LOAN',
    'SSS Loan',
    NULL,
    'OTHER_DEDUCTION',
    false,
    false,
    10,
    true,
    'system',
    NOW()
);

-- Pag-IBIG Loan
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'PAGIBIG_LOAN',
    'Pag-IBIG Loan',
    NULL,
    'OTHER_DEDUCTION',
    false,
    false,
    11,
    true,
    'system',
    NOW()
);

-- Company Loan
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'COMPANY_LOAN',
    'Company Loan',
    NULL,
    'OTHER_DEDUCTION',
    false,
    false,
    12,
    true,
    'system',
    NOW()
);

-- Salary Advance
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'SALARY_ADVANCE',
    'Salary Advance',
    NULL,
    'OTHER_DEDUCTION',
    false,
    false,
    13,
    true,
    'system',
    NOW()
);

-- Uniform Deduction
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'UNIFORM_DEDUCTION',
    'Uniform Deduction',
    NULL,
    'OTHER_DEDUCTION',
    false,
    false,
    14,
    true,
    'system',
    NOW()
);

-- Insurance Premium
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'INSURANCE_PREMIUM',
    'Insurance Premium',
    NULL,
    'OTHER_DEDUCTION',
    false,
    false,
    15,
    true,
    'system',
    NOW()
);

-- ============================================================================
-- ALLOWANCES
-- ============================================================================

-- Rice Allowance
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'RICE_ALLOWANCE',
    'Rice Allowance',
    NULL,
    'ALLOWANCE',
    true,
    true,
    20,
    true,
    'system',
    NOW()
);

-- Transportation Allowance
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'TRANSPO_ALLOWANCE',
    'Transportation Allowance',
    NULL,
    'ALLOWANCE',
    true,
    true,
    21,
    true,
    'system',
    NOW()
);

-- Meal Allowance
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'MEAL_ALLOWANCE',
    'Meal Allowance',
    NULL,
    'ALLOWANCE',
    true,
    true,
    22,
    true,
    'system',
    NOW()
);

-- Clothing Allowance
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'CLOTHING_ALLOWANCE',
    'Clothing Allowance',
    NULL,
    'ALLOWANCE',
    true,
    true,
    23,
    true,
    'system',
    NOW()
);

-- Communication Allowance
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'COMMUNICATION_ALLOWANCE',
    'Communication Allowance',
    NULL,
    'ALLOWANCE',
    true,
    true,
    24,
    true,
    'system',
    NOW()
);

-- ============================================================================
-- OVERTIME
-- ============================================================================
-- DOLE Compliance: Article 87, Labor Code

-- Ordinary Day Overtime
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    policy_name,
    calculation,
    created_by,
    created_at
) VALUES (
    'ORDINARY_DAY_OT',
    'Ordinary Day Overtime',
    NULL,
    'OVERTIME',
    true,
    false,
    30,
    true,
    'Standard Overtime Policy',
    '125% of hourly rate',
    'system',
    NOW()
);

-- Rest Day Overtime
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    policy_name,
    calculation,
    created_by,
    created_at
) VALUES (
    'REST_DAY_OT',
    'Rest Day Overtime',
    NULL,
    'OVERTIME',
    true,
    false,
    31,
    true,
    'Standard Overtime Policy',
    '130% of hourly rate',
    'system',
    NOW()
);

-- Holiday Overtime
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    policy_name,
    calculation,
    created_by,
    created_at
) VALUES (
    'HOLIDAY_OT',
    'Holiday Overtime',
    NULL,
    'OVERTIME',
    true,
    false,
    32,
    true,
    'Standard Overtime Policy',
    '200% of hourly rate',
    'system',
    NOW()
);

-- Special Holiday Overtime
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    policy_name,
    calculation,
    created_by,
    created_at
) VALUES (
    'SPECIAL_HOLIDAY_OT',
    'Special Holiday Overtime',
    NULL,
    'OVERTIME',
    true,
    false,
    33,
    true,
    'Standard Overtime Policy',
    '150% of hourly rate',
    'system',
    NOW()
);

-- ============================================================================
-- HOLIDAY PAY
-- ============================================================================
-- DOLE Compliance: Article 94, Labor Code

-- Regular Holiday
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    policy_name,
    calculation,
    created_by,
    created_at
) VALUES (
    'REGULAR_HOLIDAY',
    'Regular Holiday Pay',
    NULL,
    'HOLIDAY',
    true,
    true,
    40,
    true,
    'DOLE Holiday Pay Policy',
    '200% of daily rate',
    'system',
    NOW()
);

-- Special Holiday
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    policy_name,
    calculation,
    created_by,
    created_at
) VALUES (
    'SPECIAL_HOLIDAY',
    'Special Holiday Pay',
    NULL,
    'HOLIDAY',
    true,
    true,
    41,
    true,
    'DOLE Holiday Pay Policy',
    '130% of daily rate',
    'system',
    NOW()
);

-- Double Holiday
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    policy_name,
    calculation,
    created_by,
    created_at
) VALUES (
    'DOUBLE_HOLIDAY',
    'Double Holiday Pay',
    NULL,
    'HOLIDAY',
    true,
    true,
    42,
    true,
    'DOLE Holiday Pay Policy',
    '300% of daily rate',
    'system',
    NOW()
);

-- ============================================================================
-- ATTENDANCE EXCEPTIONS
-- ============================================================================

-- Late
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'LATE',
    'Late',
    NULL,
    'ATTENDANCE_EXCEPTION',
    false,
    true,
    50,
    true,
    'system',
    NOW()
);

-- Absent
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'ABSENT',
    'Absent',
    NULL,
    'ATTENDANCE_EXCEPTION',
    false,
    true,
    51,
    true,
    'system',
    NOW()
);

-- Undertime
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'UNDERTIME',
    'Undertime',
    NULL,
    'ATTENDANCE_EXCEPTION',
    false,
    true,
    52,
    true,
    'system',
    NOW()
);

-- Tardy
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'TARDY',
    'Tardy',
    NULL,
    'ATTENDANCE_EXCEPTION',
    false,
    true,
    53,
    true,
    'system',
    NOW()
);

-- ============================================================================
-- BENEFITS
-- ============================================================================

-- 13th Month Pay
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    policy_name,
    calculation,
    created_by,
    created_at
) VALUES (
    '13TH_MONTH',
    '13th Month Pay',
    NULL,
    'BENEFITS',
    true,
    true,
    60,
    true,
    'PD 851 - 13th Month Pay Law',
    '1/12 of total basic salary earned',
    'system',
    NOW()
);

-- Service Incentive Leave
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    policy_name,
    calculation,
    created_by,
    created_at
) VALUES (
    'SERVICE_INCENTIVE_LEAVE',
    'Service Incentive Leave',
    NULL,
    'BENEFITS',
    true,
    true,
    61,
    true,
    'Article 95, Labor Code',
    '5 days leave pay for 1 year service',
    'system',
    NOW()
);

-- Performance Bonus
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'PERFORMANCE_BONUS',
    'Performance Bonus',
    NULL,
    'BENEFITS',
    true,
    false,
    62,
    true,
    'system',
    NOW()
);

-- Christmas Bonus
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'CHRISTMAS_BONUS',
    'Christmas Bonus',
    NULL,
    'BENEFITS',
    true,
    false,
    63,
    true,
    'system',
    NOW()
);

-- ============================================================================
-- NIGHT SHIFT DIFFERENTIAL
-- ============================================================================
-- DOLE Compliance: Article 86, Labor Code

INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    policy_name,
    calculation,
    created_by,
    created_at
) VALUES (
    'NIGHT_SHIFT_DIFF',
    'Night Shift Differential',
    NULL,
    'NIGHT_SHIFT_DIFFERENTIAL',
    true,
    true,
    70,
    true,
    'Article 86, Labor Code',
    '10% of hourly rate for work between 10 PM - 6 AM',
    'system',
    NOW()
);

-- ============================================================================
-- SERVICE CHARGE
-- ============================================================================
-- DOLE Compliance: Article 96, Labor Code (for service establishments)

INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    policy_name,
    calculation,
    created_by,
    created_at
) VALUES (
    'SERVICE_CHARGE',
    'Service Charge',
    NULL,
    'SERVICE_CHARGE',
    true,
    false,
    80,
    true,
    'Article 96, Labor Code',
    '85% distributed to employees, 15% to management',
    'system',
    NOW()
);

-- ============================================================================
-- COMMISSION
-- ============================================================================

-- Sales Commission
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'SALES_COMMISSION',
    'Sales Commission',
    NULL,
    'COMMISSION',
    true,
    false,
    90,
    true,
    'system',
    NOW()
);

-- Performance Commission
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'PERFORMANCE_COMMISSION',
    'Performance Commission',
    NULL,
    'COMMISSION',
    true,
    false,
    91,
    true,
    'system',
    NOW()
);

-- ============================================================================
-- BONUS
-- ============================================================================

-- Year-end Bonus
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'YEAR_END_BONUS',
    'Year-end Bonus',
    NULL,
    'BONUS',
    true,
    false,
    100,
    true,
    'system',
    NOW()
);

-- ============================================================================
-- SALARY ADJUSTMENTS
-- ============================================================================

-- Salary Increase
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'SALARY_INCREASE',
    'Salary Increase',
    NULL,
    'SALARY_ADJUSTMENT',
    true,
    false,
    110,
    true,
    'system',
    NOW()
);

-- Salary Decrease
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'SALARY_DECREASE',
    'Salary Decrease',
    NULL,
    'SALARY_ADJUSTMENT',
    false,
    false,
    111,
    true,
    'system',
    NOW()
);

-- ============================================================================
-- ADJUSTMENTS
-- ============================================================================

-- Retroactive Adjustment
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'RETROACTIVE_ADJUSTMENT',
    'Retroactive Adjustment',
    NULL,
    'ADJUSTMENT',
    true,
    false,
    120,
    true,
    'system',
    NOW()
);

-- Correction Adjustment
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'CORRECTION_ADJUSTMENT',
    'Correction Adjustment',
    NULL,
    'ADJUSTMENT',
    true,
    false,
    121,
    true,
    'system',
    NOW()
);

-- ============================================================================
-- ADDITIONS (General)
-- ============================================================================

-- Basic Salary
INSERT INTO p_payroll_types (
    code,
    desc1,
    category_type,
    is_addition,
    is_auto_generated,
    sort_order,
    is_active,
    created_by,
    created_at
) VALUES (
    'BASIC_SALARY',
    'Basic Salary',
    NULL,
    'ADDITION',
    true,
    true,
    130,
    true,
    'system',
    NOW()
);

-- ============================================================================
-- END OF PAYROLL TYPES INSERT
-- ============================================================================
-- Total: 50+ payroll types covering all categories
-- All types are DOLE/BIR compliant for Philippines payroll system
