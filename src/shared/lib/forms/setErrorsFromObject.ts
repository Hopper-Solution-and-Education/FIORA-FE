import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

export interface ErrorResponse {
  statusCode: number;
  status: number;
  message: string;
  error: Record<string, string>; // field errors
  data?: any;
}

export function setErrorsFromObject<TFieldValues extends FieldValues>(
  errorData: string | ErrorResponse | Record<string, string>,
  setError: UseFormSetError<TFieldValues>,
) {
  try {
    let errors: Record<string, string>;

    // Handle different input types
    if (typeof errorData === 'string') {
      // If it's a JSON string, parse it
      const parsed = JSON.parse(errorData);
      errors = parsed.error || parsed;
    } else if ('error' in errorData && typeof errorData.error === 'object') {
      // If it's an ErrorResponse object with nested error property
      errors = errorData.error;
    } else {
      // If it's already a flat error object like { name: 'error message' }
      errors = errorData as Record<string, string>;
    }

    // Apply errors to form fields
    Object.entries(errors).forEach(([key, message]) => {
      setError(key as Path<TFieldValues>, {
        type: 'manual',
        message: message ?? '',
      });
    });
  } catch (e) {
    console.error('Error parsing error response:', e);
  }
}
