import { useCallback, useEffect, useState } from 'react';
import { flexiInterestUsecases } from '../../application/flexiInterestUsecases';
import { FlexiInterestStatistics } from '../slices/type';

export const useFlexiInterestStatistics = () => {
  const [statistics, setStatistics] = useState<FlexiInterestStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await flexiInterestUsecases.getFlexiInterestStatistics();
      setStatistics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch statistics');
      console.log('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics,
  };
};
