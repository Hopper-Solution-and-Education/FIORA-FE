import { signOut } from 'next-auth/react';

export interface IHttpClient {
  /**
   * Thiết lập interceptor cho request.
   * @param interceptor Hàm thay đổi cấu hình request.
   */
  setRequestInterceptor: (
    interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>,
  ) => void;

  /**
   * Thiết lập interceptor cho response.
   * @param interceptor Hàm xử lý dữ liệu response.
   */
  setResponseInterceptor: (interceptor: (data: any) => any | Promise<any>) => void;

  /**
   * Gửi yêu cầu GET.
   * @param url Endpoint API.
   * @param headers Header tùy chọn.
   * @returns Promise chứa dữ liệu kiểu T.
   */
  get<T>(url: string, headers?: HeadersInit): Promise<T>;

  /**
   * Gửi yêu cầu POST.
   * @param url Endpoint API.
   * @param body Dữ liệu gửi đi.
   * @param headers Header tùy chọn.
   * @returns Promise chứa dữ liệu kiểu T.
   */
  post<T>(url: string, body: any, headers?: HeadersInit): Promise<T>;

  /**
   * Gửi yêu cầu PUT.
   * @param url Endpoint API.
   * @param body Dữ liệu gửi đi.
   * @param headers Header tùy chọn.
   * @returns Promise chứa dữ liệu kiểu T.
   */
  put<T>(url: string, body: any, headers?: HeadersInit): Promise<T>;

  /**
   * Gửi yêu cầu PATCH.
   * @param url Endpoint API.
   * @param body Dữ liệu gửi đi.
   * @param headers Header tùy chọn.
   */
  patch<T>(url: string, body: any, headers?: HeadersInit): Promise<T>;

  /**
   * Gửi yêu cầu DELETE.
   * @param url Endpoint API.
   * @param headers Header tùy chọn.
   * @returns Promise chứa dữ liệu kiểu T.
   */
  delete<T>(url: string, headers?: HeadersInit): Promise<T>;

  /**
   * Thiết lập header toàn cục.
   * @param key Khóa của header.
   * @param value Giá trị của header.
   */
  setHeader(key: string, value: string): void;

  /**
   * Xóa header toàn cục.
   * @param key Khóa của header.
   */
  removeHeader(key: string): void;
}

class HttpClient implements IHttpClient {
  private static instance: HttpClient;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private interceptors: {
    request?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
    response?: (data: any) => any | Promise<any>;
  };

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.interceptors = {};
  }

  /**
   * Trả về instance duy nhất của HttpClient.
   */
  static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  public setRequestInterceptor(
    interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>,
  ) {
    this.interceptors.request = interceptor;
  }

  setResponseInterceptor(interceptor: (data: any) => any | Promise<any>) {
    this.interceptors.response = interceptor;
  }

  /**
   * Gửi HTTP request với cấu hình đã cho.
   * @param url Endpoint API.
   * @param options Tùy chọn fetch.
   */
  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`;

    // Convert headers to plain object
    const customHeaders =
      options.headers instanceof Headers
        ? Object.fromEntries(options.headers.entries())
        : Array.isArray(options.headers)
          ? Object.fromEntries(options.headers)
          : options.headers || {};

    let config: RequestInit = { ...options };

    // Nếu body là FormData thì KHÔNG merge defaultHeaders (để trình duyệt tự set Content-Type)
    if (options.body instanceof FormData) {
      config.headers = new Headers({ ...customHeaders });
    } else {
      config.headers = new Headers({
        ...this.defaultHeaders,
        ...customHeaders,
      });
    }

    if (this.interceptors.request) {
      config = await this.interceptors.request(config);
    }

    try {
      const response = await fetch(fullUrl, config);

      if (!response.ok) {
        // If response status is 403, log out
        if (response.status === 403 || response.status === 500) {
          await signOut();
        }
        // get response error from server
        const errorText = await response.text();
        throw new Error(errorText, { cause: 'Error' });
      }

      // Parse JSON dữ liệu
      let data = (await response.json()) as T;

      // Áp dụng Response Interceptor nếu có
      if (this.interceptors.response) {
        data = await this.interceptors.response(data);
      }
      return data;
    } catch (error) {
      console.error('HTTP Request Failed:', error);
      throw error;
    }
  }

  public get<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'GET', headers });
  }

  public post<T>(url: string, body: any, headers: HeadersInit = {}): Promise<T> {
    const options: RequestInit = { method: 'POST', headers };

    if (body instanceof FormData) {
      options.body = body;
      if (headers && (headers as any)['Content-Type']) {
        delete (headers as any)['Content-Type'];
      }
    } else {
      options.body = JSON.stringify(body);
      (headers as any)['Content-Type'] = 'application/json';
    }

    return this.request<T>(url, options);
  }

  public put<T>(url: string, body: any, headers: HeadersInit = {}): Promise<T> {
    const options: RequestInit = { method: 'PUT', headers };

    if (body instanceof FormData) {
      options.body = body;
      if (headers && (headers as any)['Content-Type']) {
        delete (headers as any)['Content-Type'];
      }
    } else {
      options.body = JSON.stringify(body);
      (headers as any)['Content-Type'] = 'application/json';
    }

    return this.request<T>(url, options);
  }

  public patch<T>(url: string, body: any, headers: HeadersInit = {}): Promise<T> {
    const options: RequestInit = { method: 'PATCH', headers };

    if (body instanceof FormData) {
      options.body = body;
      if (headers && (headers as any)['Content-Type']) {
        delete (headers as any)['Content-Type'];
      }
    } else {
      options.body = JSON.stringify(body);
      (headers as any)['Content-Type'] = 'application/json';
    }

    return this.request<T>(url, options);
  }

  public delete<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'DELETE', headers });
  }

  public setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  public removeHeader(key: string) {
    delete this.defaultHeaders[key];
  }
}

export const httpClient = HttpClient.getInstance();
