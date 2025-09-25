import { useState } from 'react';

interface RetryReferralParams {
  id: string;
  amount: string;
  reason: string;
}

interface RetryReferralResponse {
  id: string;
  status: string;
  amount: number;
  reason: string;
  updatedBy: string;
  updatedAt: string;
}

export const useRetryReferral = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const retryReferral = async (
    params: RetryReferralParams,
  ): Promise<RetryReferralResponse | null> => {
    setIsRetrying(true);
    setError(null);

    try {
      const response = await fetch(`/api/dashboard/referral/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: params.amount,
          reason: params.reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to retry referral');
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message || 'An error occurred while retrying referral');
      return null;
    } finally {
      setIsRetrying(false);
    }
  };

  return {
    retryReferral,
    isRetrying,
    error,
    clearError: () => setError(null),
  };
};
