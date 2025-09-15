'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const WalletWithdrawButton = () => {
  const router = useRouter();

  const handleDeposit = useCallback(() => {
    router.push(RouteEnum.WalletDeposit);
  }, [router]);

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Deposit"
      onClick={handleDeposit}
      className="h-fit w-fit !px-4 !py-2"
    >
      <Icons.banknoteArrowDown className="!h-6 !w-6 text-red-600" />
    </Button>
  );
};

export default WalletWithdrawButton;
