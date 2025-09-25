import { useMemo } from 'react';

export const useReferralCode = (initialCode?: string | null) => {
  const referralCode = initialCode?.trim() ? initialCode : '';

  const referralLink = useMemo(() => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const code = referralCode || '';
    return `${base}/auth/sign-up?ref=${code}`;
  }, [referralCode]);

  return {
    referralCode,
    referralLink,
  };
};
