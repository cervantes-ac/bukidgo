// Form validation utilities
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (min 8 chars, 1 uppercase, 1 number)
export const validatePassword = (password: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong' } => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinLength = password.length >= 8;

  if (!hasMinLength) return { isValid: false, strength: 'weak' };
  if (hasUpperCase && hasNumber) return { isValid: true, strength: 'strong' };
  if (hasUpperCase || hasNumber) return { isValid: true, strength: 'medium' };
  return { isValid: true, strength: 'weak' };
};

// Phone validation (basic)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Required field validation
export const validateRequired = (value: string | number | undefined): boolean => {
  return value !== undefined && value !== null && String(value).trim() !== '';
};

// Min length validation
export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

// Max length validation
export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

// Number range validation
export const validateRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

// Form validation helper
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => string | null>
): ValidationResult => {
  const errors: ValidationError[] = [];

  Object.entries(rules).forEach(([field, validator]) => {
    const error = validator(data[field]);
    if (error) {
      errors.push({ field, message: error });
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Common validation rules
export const validationRules = {
  email: (value: string) => {
    if (!validateRequired(value)) return 'Email is required';
    if (!validateEmail(value)) return 'Please enter a valid email address';
    return null;
  },
  password: (value: string) => {
    if (!validateRequired(value)) return 'Password is required';
    const { isValid } = validatePassword(value);
    if (!isValid) return 'Password must be at least 8 characters with uppercase and number';
    return null;
  },
  phone: (value: string) => {
    if (!validateRequired(value)) return 'Phone number is required';
    if (!validatePhone(value)) return 'Please enter a valid phone number';
    return null;
  },
  required: (value: any) => {
    if (!validateRequired(value)) return 'This field is required';
    return null;
  },
  minLength: (min: number) => (value: string) => {
    if (!validateMinLength(value, min)) return `Must be at least ${min} characters`;
    return null;
  },
  maxLength: (max: number) => (value: string) => {
    if (!validateMaxLength(value, max)) return `Must not exceed ${max} characters`;
    return null;
  }
};
