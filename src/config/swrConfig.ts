import useSWR, { SWRConfiguration } from 'swr';

/**
 * Global fetcher function using fetch API.
 * Automatically adds headers and error handling.
 */
const fetcher = async (url: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Default SWR configuration.
 */
export const swrOptions: SWRConfiguration = {
  fetcher,
  dedupingInterval: 5000, // Cache thời gian 5 giây
  revalidateOnFocus: true, // Refetch khi cửa sổ quay lại focus
  revalidateOnReconnect: true, // Refetch khi kết nối mạng lại
  shouldRetryOnError: true, // Thử lại khi có lỗi
};

/**
 * Custom SWR Hook với cấu hình mặc định.
 */
export function useCustomSWR<T>(key: string) {
  return useSWR<T>(key, swrOptions);
}
