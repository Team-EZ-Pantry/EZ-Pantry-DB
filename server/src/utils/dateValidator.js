// Date validation and parsing for expiration dates
// Supports: YYYY-MM-DD, YYYY-MM, YYYY

const FULL_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const YEAR_MONTH_REGEX = /^\d{4}-\d{2}$/;
const YEAR_ONLY_REGEX = /^\d{4}$/;

/**
 * Validates and normalizes an expiration date string.
 *
 * Supported formats:
 * - YYYY-MM-DD: Used as-is (e.g., "2026-02-05")
 * - YYYY-MM: Converts to last day of month (e.g., "2026-02" -> "2026-02-28")
 * - YYYY: Converts to Dec 31 of that year (e.g., "2026" -> "2026-12-31")
 *
 * @param {string} dateString - The date string to validate
 * @returns {Object} - { isValid, error, normalizedDate }
 */
function validateExpirationDate(dateString) {
  if (!dateString || dateString.trim() === '') {
    return {
      isValid: true,
      error: null,
      normalizedDate: null
    };
  }

  const trimmed = dateString.trim();

  // Full date: YYYY-MM-DD
  if (FULL_DATE_REGEX.test(trimmed)) {
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) {
      return {
        isValid: false,
        error: 'Invalid date. Please use format YYYY-MM-DD (e.g., 2026-02-05)',
        normalizedDate: null
      };
    }
    // Verify the date components match (catches invalid dates like 2026-02-31)
    const [year, month, day] = trimmed.split('-').map(Number);
    if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
      return {
        isValid: false,
        error: `Invalid date: ${trimmed} does not exist`,
        normalizedDate: null
      };
    }
    return {
      isValid: true,
      error: null,
      normalizedDate: trimmed
    };
  }

  // Year and month: YYYY-MM -> last day of month
  if (YEAR_MONTH_REGEX.test(trimmed)) {
    const [year, month] = trimmed.split('-').map(Number);

    if (month < 1 || month > 12) {
      return {
        isValid: false,
        error: 'Invalid month. Must be between 01 and 12',
        normalizedDate: null
      };
    }

    // Get last day of month by going to day 0 of next month
    const lastDay = new Date(year, month, 0).getDate();
    const normalizedDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    return {
      isValid: true,
      error: null,
      normalizedDate
    };
  }

  // Year only: YYYY -> Dec 31
  if (YEAR_ONLY_REGEX.test(trimmed)) {
    const year = parseInt(trimmed, 10);

    if (year < 1900 || year > 2100) {
      return {
        isValid: false,
        error: 'Year must be between 1900 and 2100',
        normalizedDate: null
      };
    }

    return {
      isValid: true,
      error: null,
      normalizedDate: `${year}-12-31`
    };
  }

  // Invalid format
  return {
    isValid: false,
    error: 'Invalid date format. Use YYYY-MM-DD, YYYY-MM, or YYYY',
    normalizedDate: null
  };
}

module.exports = {
  validateExpirationDate
};
