'use client';

import { useEffect, useState } from 'react';
import { SavingApi } from '../data/api';
import { SavingOverviewResponse } from '../data/tdo/response/SavingOverviewResponse';

const savingApi = new SavingApi();

function useFetchDataOverview(id: string) {
  const [data, setData] = useState<SavingOverviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await savingApi.getSavingWalletOverview(id as string);
        setData(res);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
}

export default useFetchDataOverview;
