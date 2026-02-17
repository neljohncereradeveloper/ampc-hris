export const REGEX_CONST = {
    // ========================
    // BASIC TEXT
    // ========================
    LETTERS_ONLY: /^[A-Za-z]+$/,
    LETTERS_SPACE: /^[A-Za-z ]+$/,
    LETTER_NUMBER: /^[A-Za-z0-9]+$/,
    LETTER_NUMBER_SPACE: /^[A-Za-z0-9 ]+$/,
    LETTER_NUMBER_UNDERSCORE: /^[A-Za-z0-9_]+$/,
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

    // ========================
    // NAMES
    // ========================
    PERSON_NAME: /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/,

    // ========================
    // NUMBERS
    // ========================
    INTEGER: /^\d+$/,
    POSITIVE_INTEGER: /^[1-9]\d*$/,
    DECIMAL_2_PLACES: /^\d+(\.\d{1,2})?$/,
    SIGNED_DECIMAL: /^-?\d+(\.\d+)?$/,

    // ========================
    // DESCRIPTION
    // ========================
    DESCRIPTION: /^[A-Za-z0-9\s.,()\-_'"/&!?#:;]*$/,
    DESCRIPTION_MULTILINE: /^[A-Za-z0-9\s.,()\-_'"/&!?#:;\r\n]*$/,

    // ========================
    // CONTACT
    // ========================
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PH_MOBILE: /^(09|\+639)\d{9}$/,

    // ========================
    // PASSWORD
    // ========================
    STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};
