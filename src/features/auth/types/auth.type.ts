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

export interface SignUpPayload {
  email: string;
  password: string;
}
