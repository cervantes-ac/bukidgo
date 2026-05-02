// Firebase error message mapping
export const getFirebaseErrorMessage = (code: string): string => {
  const errorMap: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password is too weak. Use at least 8 characters with uppercase and numbers.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/too-many-requests': 'Too many login attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested resource was not found.',
    'already-exists': 'This resource already exists.',
    'failed-precondition': 'The operation failed due to a precondition. Please try again.',
    'aborted': 'The operation was aborted. Please try again.',
    'out-of-range': 'The value is out of range.',
    'unimplemented': 'This feature is not yet implemented.',
    'internal': 'An internal error occurred. Please try again later.',
    'unavailable': 'The service is temporarily unavailable. Please try again later.',
    'data-loss': 'Unrecoverable data loss or corruption.',
    'unauthenticated': 'You must be logged in to perform this action.',
  };

  return errorMap[code] || 'An unexpected error occurred. Please try again.';
};

// Network error detection
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;
  const message = error.message?.toLowerCase() || '';
  return message.includes('network') || message.includes('offline') || message.includes('fetch');
};

// Timeout error detection
export const isTimeoutError = (error: any): boolean => {
  if (!error) return false;
  const message = error.message?.toLowerCase() || '';
  return message.includes('timeout') || message.includes('timed out');
};

// Format error for display
export const formatErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.code) return getFirebaseErrorMessage(error.code);
  if (error?.message) return error.message;
  return 'An unexpected error occurred. Please try again.';
};
