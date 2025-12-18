import apiClient from '@/config/http-client';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { BaseResponse } from '@/shared/types';
import { User } from '@/store/types/user.type';
import {
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
  SignUpPayload,
} from '../types/auth.type';

class AuthService {
  async login(payload: LoginPayload): Promise<BaseResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>(ApiEndpointEnum.Login, payload);

    if (response.statusCode === RESPONSE_CODE.OK) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }

    return response;
  }

  async getMe(): Promise<BaseResponse<User>> {
    return await apiClient.get(ApiEndpointEnum.Me);
  }

  async signUp(payload: SignUpPayload): Promise<BaseResponse<null>> {
    return await apiClient.post(ApiEndpointEnum.SignUp, payload);
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<BaseResponse<null>> {
    return await apiClient.post(ApiEndpointEnum.ResetPassword, payload);
  }

  async sendOtp(email: string): Promise<BaseResponse<null>> {
    return await apiClient.post(ApiEndpointEnum.SendOtpForgotPassword, { email });
  }

  async logout(): Promise<void> {
    await apiClient.post(ApiEndpointEnum.SignOut);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('signupMsg');
  }
}

export const authService = new AuthService();
