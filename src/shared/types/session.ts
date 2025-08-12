import { UserRole } from '@prisma/client';

// User interface for session
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: UserRole;
}
