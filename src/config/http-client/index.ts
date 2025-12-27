import { ApiEndpointEnum, BASE_API } from '@/shared/constants/ApiEndpointEnum';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { BaseResponse, ErrorResponse } from '@/shared/types';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'sonner';

// Endpoints that should not be retried on 401
const nonRetryEndpoints: string[] = [ApiEndpointEnum.Refresh];

export interface ApiRequestOptions {
  disableToast?: boolean;
  exclude?: string[];
  headers?: Record<string, string>;
}

export class ApiClient {
  private axiosInstance: AxiosInstance;
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle 401 and refresh token
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized - token expired
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !nonRetryEndpoints.includes(originalRequest.url || '')
        ) {
          originalRequest._retry = true;

          try {
            await this.handleTokenRefresh();
            // Retry the original request with new token
            // We need to update the header with the new token
            const newToken = localStorage.getItem('accessToken');
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private async handleTokenRefresh(): Promise<void> {
    // If already refreshing, wait for that promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    // Start refresh process
    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token');
      }

      // Create a separate instance for refresh to avoid interceptor loops
      const refreshClient = axios.create({
        baseURL: this.axiosInstance.defaults.baseURL,
      });

      const response = await refreshClient.post(
        ApiEndpointEnum.Refresh,
        {}, // Body is empty as token is in header
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refreshToken}`,
          },
        },
      );

      const data = response.data;

      // Assuming successful refresh returns new tokens in data.data
      const { accessToken, refreshToken: _refreshToken } = data.data || {};

      if (accessToken && _refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', _refreshToken);
      } else {
        throw new Error('Refresh failed - invalid response format');
      }
    } catch (error) {
      console.error('❌ Token refresh failed, clearing auth data:', error);
      // Refresh failed, logout user
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Dispatch session-expired event to disconnect wallet
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session-expired'));
        window.location.href = RouteEnum.SignIn;
      }
      throw error;
    }
  }

  private async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string,
    payload?: any,
    options?: ApiRequestOptions,
  ): Promise<BaseResponse<T>> {
    try {
      let response: AxiosResponse;
      const requestConfig: AxiosRequestConfig = {
        headers: options?.headers,
      };

      // Make the request based on method
      if (method === 'get' || method === 'delete') {
        response = await this.axiosInstance[method](endpoint, {
          ...requestConfig,
          params: payload,
        });
      } else {
        response = await this.axiosInstance[method](endpoint, payload, requestConfig);
      }

      const data = response.data;

      // Check if response follows our standard format
      // Adjust this check based on your actual BaseResponse structure
      if (data && typeof data === 'object') {
        return data as BaseResponse<T>;
      } else {
        // Fallback for non-standard responses
        return {
          statusCode: response.status,
          message: 'Success',
          data: data,
        } as BaseResponse<T>;
      }
    } catch (error: any) {
      // Handle all errors in one place
      let apiError: ErrorResponse;

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response?.data) {
          // Assume the backend returns ErrorResponse structure
          apiError = axiosError.response.data as ErrorResponse;
        } else {
          // Network or other errors - Synthesize ErrorResponse
          apiError = {
            statusCode: axiosError.response?.status || 0,
            message: axiosError.message || 'Network error or server unavailable',
            errors: {
              errorCode: 'NETWORK_ERROR',
              details: [],
            },
          };
        }
      } else {
        // Unknown error
        apiError = {
          statusCode: 0,
          message: error instanceof Error ? error.message : 'Unknown error',
          errors: {
            errorCode: 'UNKNOWN_ERROR',
            details: [],
          },
        };
      }

      // Show toast notification for errors (unless disabled)
      if (!options?.disableToast && !options?.exclude?.includes(endpoint)) {
        toast.error(apiError.message || 'Oops!, something went wrong...');
      }

      throw apiError;
    }
  }

  // GET request
  async get<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    options?: ApiRequestOptions,
  ): Promise<BaseResponse<T>> {
    return this.request<T>('get', endpoint, params, options);
  }

  // POST request
  async post<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions,
  ): Promise<BaseResponse<T>> {
    return this.request<T>('post', endpoint, data, options);
  }

  // PUT request
  async put<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions,
  ): Promise<BaseResponse<T>> {
    return this.request<T>('put', endpoint, data, options);
  }

  // PATCH request
  async patch<T = any>(
    endpoint: string,
    data?: any,
    options?: ApiRequestOptions,
  ): Promise<BaseResponse<T>> {
    return this.request<T>('patch', endpoint, data, options);
  }

  // DELETE request
  async delete<T = any>(
    endpoint: string,
    params?: Record<string, any>,
    options?: ApiRequestOptions,
  ): Promise<BaseResponse<T>> {
    return this.request<T>('delete', endpoint, params, options);
  }

  // File upload (FormData)
  async upload<T = any>(
    endpoint: string,
    formData: FormData,
    options?: ApiRequestOptions,
  ): Promise<BaseResponse<T>> {
    // Specialized upload handling to ensure correct headers
    const uploadOptions: ApiRequestOptions = {
      ...options,
      headers: {
        ...options?.headers,
        'Content-Type': 'multipart/form-data',
      },
    };
    return this.request<T>('post', endpoint, formData, uploadOptions);
  }
}

const apiClient = new ApiClient(BASE_API as string);

export default apiClient;
