import apiClient from '@/config/http-client';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { BaseResponse } from '@/shared/types';

export interface LoginPayload {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    address?: string | null;
    birthday?: string | null;
    isBlocked?: boolean;
    role?: string;
  };
}

class AuthService {
  async login(payload: LoginPayload): Promise<BaseResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>(ApiEndpointEnum.Login, payload);

    if (response.statusCode === RESPONSE_CODE.OK) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response;
  }

  async logout(): Promise<void> {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Optional: Call backend logout endpoint if exists
      // await apiClient.post(ApiEndpointEnum.Logout);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
}

export const authService = new AuthService();
