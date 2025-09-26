'use client';

import { useEffect, useState } from 'react';
import { SavingApi } from '../data/api';
import { CreateSavingClaimRequest } from '../data/tdo/request/CreateSavingClaimRequest';
import { SavingTransactionResponse } from '../data/tdo/response/SavingTransactionResponse';

const savingApi = new SavingApi();

function useClaim(request: CreateSavingClaimRequest) {
  const [data, setData] = useState<SavingTransactionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!request) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await savingApi.createSavingClaim(request);
        setData(res);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [request]);

  return { data, loading, error };
}

export default useClaim;
