'use client';

import { useEffect, useState } from 'react';
import { SavingApi } from '../data/api';
import { CreateSavingHistoryRequest } from '../data/tdo/request/CreateSavingHistoryRequest';
import { SavingHistoryResponse } from '../data/tdo/response/SavingHistoryResponse';

const savingApi = new SavingApi();

function useFetchDataTransactionHistory(filter: CreateSavingHistoryRequest) {
  const [data, setData] = useState<SavingHistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!filter) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await savingApi.getSavingTransactionHistory(filter);
        setData(res);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  return { data, loading, error };
}

export default useFetchDataTransactionHistory;
