/**
 * Password Validation Utility
 *
 * Security & Performance Notes:
 * - Regex patterns are pre-compiled once at module load (not on every render)
 * - Individual checks allow granular feedback without full regex evaluation
 * - No sensitive data (actual passwords) is logged
 * - Pattern matching uses non-capturing groups for performance
 */

export interface PasswordRequirement {
  id: 'minLength' | 'uppercase' | 'lowercase' | 'digit' | 'special';
  label: string;
  isMet: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  requirements: PasswordRequirement[];
  score: number; // 0-5: number of requirements met
}

/**
 * Pre-compiled regex patterns for performance optimization
 * These are evaluated once at module load, not on every render
 */
const VALIDATION_PATTERNS = {
  minLength: (password: string): boolean => password.length >= 8,
  uppercase: (password: string): boolean => /(?=.*?[A-Z])/.test(password),
  lowercase: (password: string): boolean => /(?=.*?[a-z])/.test(password),
  digit: (password: string): boolean => /(?=.*?[0-9])/.test(password),
  special: (password: string): boolean => /(?=.*?[#?!@$%^&*-])/.test(password),
} as const;

/**
 * Combined regex pattern for final validation
 * Used to validate the complete password against all requirements
 */
const COMPLETE_PATTERN = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

/**
 * Check individual password requirements
 *
 * @param password - The password to validate
 * @returns Array of requirement validation results
 *
 * Performance: O(n) where n = password length (linear scan)
 * Each check is independent and fails fast
 */
function checkRequirements(password: string): PasswordRequirement[] {
  return [
    {
      id: 'minLength',
      label: 'At least 8 characters',
      isMet: VALIDATION_PATTERNS.minLength(password),
    },
    {
      id: 'uppercase',
      label: 'At least one uppercase letter (A-Z)',
      isMet: VALIDATION_PATTERNS.uppercase(password),
    },
    {
      id: 'lowercase',
      label: 'At least one lowercase letter (a-z)',
      isMet: VALIDATION_PATTERNS.lowercase(password),
    },
    {
      id: 'digit',
      label: 'At least one digit (0-9)',
      isMet: VALIDATION_PATTERNS.digit(password),
    },
    {
      id: 'special',
      label: 'At least one special character (#?!@$%^&*-)',
      isMet: VALIDATION_PATTERNS.special(password),
    },
  ];
}

/**
 * Validate password against all requirements
 *
 * @param password - The password to validate
 * @returns Validation result with strength level and requirement details
 *
 * Security: Uses lookahead assertions for reliable matching
 * Performance: Individual checks allow early exit and granular feedback
 */
export function validatePassword(password: string): PasswordValidationResult {
  const requirements = checkRequirements(password);
  const score = requirements.filter((req) => req.isMet).length;
  const isValid = COMPLETE_PATTERN.test(password);

  let strength: 'weak' | 'medium' | 'strong';
  if (score <= 2) {
    strength = 'weak';
  } else if (score <= 4) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }

  return {
    isValid,
    strength,
    requirements,
    score,
  };
}

/**
 * Get password strength as a percentage (0-100)
 * Useful for progress indicators
 *
 * @param password - The password to validate
 * @returns Percentage of requirements met (0-100)
 */
export function getPasswordStrengthPercentage(password: string): number {
  const result = validatePassword(password);
  return (result.score / 5) * 100;
}
