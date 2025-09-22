import { useState } from 'react';

interface RetrySavingInterestParams {
  id: string;
  savingInterestAmount: string;
  reason: string;
}

interface RetrySavingInterestResponse {
  id: string;
  status: string;
  savingInterestAmount: number;
  reason: string;
  updatedBy: string;
  updatedAt: string;
}

export const useRetrySavingInterest = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retrySavingInterest = async (
    params: RetrySavingInterestParams,
  ): Promise<RetrySavingInterestResponse | null> => {
    setIsRetrying(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard/saving-interest/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          savingInterestAmount: params.savingInterestAmount,
          reason: params.reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to retry saving interest');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred while retrying saving interest');
      return null;
    } finally {
      setIsRetrying(false);
    }
  };

  return {
    retrySavingInterest,
    isRetrying,
    error,
    clearError: () => setError(null),
  };
};
