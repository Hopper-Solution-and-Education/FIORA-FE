'use client';

import { useFileUpload } from '@/features/profile/presentation/modules/eKyc/shared/hooks';

export const useBankAccountUpload = () => {
  return useFileUpload();
};
