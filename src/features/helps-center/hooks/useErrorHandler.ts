import { useCallback } from 'react';
import { toast } from 'sonner';

interface ApiError {
  data?: {
    error?: string;
    message?: string;
    details?: string;
  };
  message?: string;
}

export const useErrorHandler = () => {
  const extractErrorMessage = useCallback((error: any): string => {
    if (typeof error === 'string') return error;

    const apiError = error as ApiError;
    if (apiError?.data?.error) return apiError.data.error;
    if (apiError?.data?.message) return apiError.data.message;
    if (apiError?.data?.details) return apiError.data.details;
    if (apiError?.message) return apiError.message;

    return 'An unexpected error occurred';
  }, []);

  const handleError = useCallback(
    (error: any, customMessage?: string) => {
      const message = customMessage || extractErrorMessage(error);
      toast.error(message);
      console.error('Error:', error);
    },
    [extractErrorMessage],
  );

  const handleSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  return {
    extractErrorMessage,
    handleError,
    handleSuccess,
  };
};
