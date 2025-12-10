import { BackendError } from '../types';

export class ErrorUtils {
  static parseBackendError(error: any): string {
    if (!error) return 'An unexpected error occurred.';

    // Connection refused / Network error
    if (error.code === 'ECONNREFUSED' || error.message === 'Network Error') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    // Axios response error
    if (error.response?.data) {
      const backendError = error.response.data as BackendError;

      // Handle Validation Errors (400)
      if (backendError.errors?.details && Array.isArray(backendError.errors.details)) {
        // Collect all constraint messages
        const messages = backendError.errors.details
          .map((detail) => {
            if (typeof detail.constraints === 'string') {
              return detail.constraints;
            } else if (typeof detail.constraints === 'object') {
              return Object.values(detail.constraints).join(', ');
            }
            return '';
          })
          .filter(Boolean);

        if (messages.length > 0) {
          return messages.join('\n');
        }
      }

      // Fallback to main error message or error code
      if (backendError.errors?.message) {
        return backendError.errors.message;
      }
      //   if (backendError.message) {
      //     return backendError.message;
      //   }
    }

    // Standard JavaScript Error
    return error.message || 'An unexpected error occurred.';
  }
}
