import { GetCurrentTierResponse } from '@/features/home/module/membership/domain/entities';

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string;
  role: string;
  address: string;
  birthday: string;
  isBlocked: boolean;
}

interface UserStateType {
  user: User | null;
  userTier: {
    data: GetCurrentTierResponse | null;
    isLoading: boolean;
  };
}

const initialUserState: UserStateType = {
  user: null,
  userTier: {
    data: null,
    isLoading: false,
  },
};

export { initialUserState };
export type { User, UserStateType };
