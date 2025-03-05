import { Session } from 'next-auth';

export interface CustomSession extends Session {
  user: User & { id: string };
  expiredTime: number;
}

export interface User {
  id: string;
  name?: string | null | undefined;
  email?: string | null;
  image?: string | null;
  rememberMe?: boolean;
}
