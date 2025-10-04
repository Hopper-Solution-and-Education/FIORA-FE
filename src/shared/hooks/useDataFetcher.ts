'use client';
import { RequestType, Response } from '@/shared/types';
import { toast } from 'sonner';
import useSWR from 'swr';

type DataFetcherProps = {
  endpoint: string | null;
  method: RequestType;
  body?: any;
  refreshInterval?: number;
  isEnabled?: boolean;
};
const useDataFetcher = <T = any>(props: DataFetcherProps) => {
  const { endpoint, method, body, refreshInterval = 0, isEnabled = true } = props;

  async function fetchData(url: string) {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: method,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error || data.message || 'Something went wrong!');
      return null;
    }
    return data as Response<T>;
  }

  const { data, isLoading, isValidating, error, mutate } = useSWR(
    isEnabled ? endpoint : null,
    fetchData,
    {
      shouldRetryOnError: false,
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateIfError: false,
      refreshInterval,
      onError: (error: any) => {
        toast.error(error.message || 'Something went wrong!');
      },
    },
  );

  return { data, isLoading, isValidating, error, mutate };
};

export default useDataFetcher;
