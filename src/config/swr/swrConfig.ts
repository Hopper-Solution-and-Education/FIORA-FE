'use client';
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
  dedupingInterval: 300000, // 5 phút
  revalidateOnFocus: false, // Refetch khi cửa sổ quay lại focus
  revalidateOnReconnect: false, // Refetch khi kết nối mạng lại
  revalidateIfStale: false, // Refetch khi dữ liệu cũ
  refreshWhenHidden: false, // Refetch khi tab ẩn
  refreshInterval: 0,
  refreshWhenOffline: false, // Refetch khi offline
  shouldRetryOnError: true, // Thử lại khi có lỗi
};
/**
 * Custom SWR Hook với cấu hình mặc định.
 */
export function useCustomSWR<T>(
  key: string,
  customFetcher?: (() => Promise<T>) | null,
  options?: SWRConfiguration,
) {
  return useSWR<T>(key, customFetcher ?? null, { ...swrOptions, ...options });
}
