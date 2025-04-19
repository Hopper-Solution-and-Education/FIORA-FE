import { toast } from 'sonner';
import useSWR from 'swr';
import { RequestType, Response } from '@/shared/types/Common.types';

type DataFetcherProps = {
  endpoint: string | null;
  method: RequestType;
  body?: any;
};
const useDataFetcher = <T = any>(props: DataFetcherProps) => {
  const { endpoint, method, body } = props;

  async function fetchData(url: string) {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      method: method, // Use the method from props
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error || data.message || 'Something went wrong!');
      return null;
    }
    return data as Response<T>;
  }

  const { data, isLoading, isValidating, error, mutate } = useSWR(endpoint, fetchData, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  return { data, isLoading, isValidating, error, mutate };
};

export default useDataFetcher;
