import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      rememberMe?: boolean;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    rememberMe?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    image?: string | null;
    rememberMe?: boolean;
  }
}
