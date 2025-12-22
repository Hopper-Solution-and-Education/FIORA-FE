import { User } from '@/store/types/user.type';

export interface LoginPayload {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface SignUpPayload {
  email: string;
  password: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  otp: string;
}
