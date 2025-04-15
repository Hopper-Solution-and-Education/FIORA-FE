import { FieldValues, Path, UseFormSetError } from 'react-hook-form';

interface ErrorResponse {
  statusCode: number;
  status: string;
  message: string;
  error: Record<string, string>; // field errors
  data: any;
}

export function setErrorsFromObject<TFieldValues extends FieldValues>(
  errors: any,
  setError: UseFormSetError<TFieldValues>,
) {
  const errorResponse: ErrorResponse = JSON.parse(errors as any);
  Object.entries(errorResponse.error).forEach(([key, message]) => {
    setError(key as Path<TFieldValues>, {
      type: 'manual',
      message: message ?? '',
    });
  });
}
