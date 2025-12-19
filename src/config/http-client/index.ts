import { ApiEndpointEnum, BASE_API } from '@/shared/constants/ApiEndpointEnum';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { BaseResponse, ErrorResponse } from '@/shared/types';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Endpoints that should not be retried on 401
const nonRetryEndpoints: string[] = [];

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

      const { accessToken, refreshToken: _refreshToken } = data.data;

      // Assuming successful refresh returns new tokens in data
      if (accessToken && _refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', _refreshToken);
      } else {
        throw new Error('Refresh failed');
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

  private handleResponse<T>(response: any): BaseResponse<T> {
    // The BE always returns { statusCode, message, data }
    // Axios response.data contains this object

    // Check if the response is a BaseResponse
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format');
    }

    return response.data as BaseResponse<T>;
  }

  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      if (axiosError.response?.data) {
        // Throw the actual error response from BE
        throw axiosError.response.data;
      }
    }

    throw error;
  }

  // GET request
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<BaseResponse<T>> {
    try {
      const response = await this.axiosInstance.get(endpoint, { params });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // POST request
  async post<T = any>(endpoint: string, data?: any): Promise<BaseResponse<T>> {
    try {
      const response = await this.axiosInstance.post(endpoint, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // PUT request
  async put<T = any>(endpoint: string, data?: any): Promise<BaseResponse<T>> {
    try {
      const response = await this.axiosInstance.put(endpoint, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // PATCH request
  async patch<T = any>(endpoint: string, data?: any): Promise<BaseResponse<T>> {
    try {
      const response = await this.axiosInstance.patch(endpoint, data);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // DELETE request
  async delete<T = any>(endpoint: string): Promise<BaseResponse<T>> {
    try {
      const response = await this.axiosInstance.delete(endpoint);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // File upload (FormData)
  async upload<T = any>(endpoint: string, formData: FormData): Promise<BaseResponse<T>> {
    try {
      const response = await this.axiosInstance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

const apiClient = new ApiClient(BASE_API as string);

export default apiClient;
