/**
 * Singleton HTTP Client using Fetch API.
 * - Supports interceptors for request and response.
 * - Handles global headers and authentication.
 * - Provides standard HTTP methods (GET, POST, PUT, DELETE).
 */
export interface IHttpClient {
  /**
   * Sets a request interceptor.
   * @param interceptor Function that modifies the request config.
   */
  setRequestInterceptor: (
    interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>,
  ) => void;

  /**
   * Sets a response interceptor.
   * @param interceptor Function that modifies the response.
   */
  setResponseInterceptor: (
    interceptor: (response: Response) => Response | Promise<Response>,
  ) => void;

  /**
   * Sends a GET request.
   * @param url API endpoint.
   * @param headers Optional headers.
   * @returns Promise resolving to the response data of type T.
   */
  get<T>(url: string, headers?: HeadersInit): Promise<T>;

  /**
   * Sends a POST request.
   * @param url API endpoint.
   * @param body Request body.
   * @param headers Optional headers.
   * @returns Promise resolving to the response data of type T.
   */
  post<T>(url: string, body: any, headers?: HeadersInit): Promise<T>;

  /**
   * Sends a PUT request.
   * @param url API endpoint.
   * @param body Request body.
   * @param headers Optional headers.
   * @returns Promise resolving to the response data of type T.
   */
  put<T>(url: string, body: any, headers?: HeadersInit): Promise<T>;

  /**
   * Sends a DELETE request.
   * @param url API endpoint.
   * @param headers Optional headers.
   * @returns Promise resolving to the response data of type T.
   */
  delete<T>(url: string, headers?: HeadersInit): Promise<T>;

  /**
   * Sets a global header.
   * @param key Header key.
   * @param value Header value.
   */
  setHeader(key: string, value: string): void;

  /**
   * Removes a global header.
   * @param key Header key.
   */
  removeHeader(key: string): void;
}

class HttpClient implements IHttpClient {
  private static instance: HttpClient;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private interceptors: {
    request?: (config: RequestInit) => RequestInit | Promise<RequestInit>;
    response?: (response: Response) => Response | Promise<Response>;
  };

  private constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
    this.interceptors = {};
  }

  /**
   * Returns the singleton instance of HttpClient.
   */
  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  /**
   * Sets a request interceptor.
   * @param interceptor Function that modifies the request config.
   */
  public setRequestInterceptor(
    interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>,
  ) {
    this.interceptors.request = interceptor;
  }

  /**
   * Sets a response interceptor.
   * @param interceptor Function that modifies the response.
   */
  public setResponseInterceptor(interceptor: (response: Response) => Response | Promise<Response>) {
    this.interceptors.response = interceptor;
  }

  /**
   * Sends an HTTP request.
   * @param url API endpoint.
   * @param options Fetch request options.
   */
  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const fullUrl = `${this.baseURL}${url}`;
    let config: RequestInit = {
      ...options,
      headers: { ...this.defaultHeaders, ...options.headers },
    };

    // Apply Request Interceptor
    if (this.interceptors.request) {
      config = await this.interceptors.request(config);
    }

    try {
      const response = await fetch(fullUrl, config);

      // Apply Response Interceptor
      if (this.interceptors.response) {
        return this.interceptors.response(response) as Promise<T>;
      }

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      console.error('HTTP Request Failed:', error);
      throw error;
    }
  }

  /**
   * Sends a GET request.
   * @param url API endpoint.
   * @param headers Optional headers.
   */
  public get<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'GET', headers });
  }

  /**
   * Sends a POST request.
   * @param url API endpoint.
   * @param body Request body.
   * @param headers Optional headers.
   */
  public post<T>(url: string, body: any, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'POST', body: JSON.stringify(body), headers });
  }

  /**
   * Sends a PUT request.
   * @param url API endpoint.
   * @param body Request body.
   * @param headers Optional headers.
   */
  public put<T>(url: string, body: any, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'PUT', body: JSON.stringify(body), headers });
  }

  /**
   * Sends a DELETE request.
   * @param url API endpoint.
   * @param headers Optional headers.
   */
  public delete<T>(url: string, headers: HeadersInit = {}): Promise<T> {
    return this.request<T>(url, { method: 'DELETE', headers });
  }

  /**
   * Sets a global header.
   * @param key Header key.
   * @param value Header value.
   */
  public setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }

  /**
   * Removes a global header.
   * @param key Header key.
   */
  public removeHeader(key: string) {
    delete this.defaultHeaders[key];
  }
}

export const httpClient = HttpClient.getInstance();
