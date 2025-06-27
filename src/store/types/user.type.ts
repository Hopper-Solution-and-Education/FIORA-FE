'use client';

import { GetCurrentTierResponse } from '@/features/home/module/membership/domain/entities';

interface UserStateType {
  userTier: {
    data: GetCurrentTierResponse | null;
    isLoading: boolean;
  };
}

const initialUserState: UserStateType = {
  userTier: {
    data: null,
    isLoading: false,
  },
};

export { initialUserState };
export type { UserStateType };
