'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const WalletDepositButton = () => {
  const router = useRouter();

  const handleDeposit = useCallback(() => {
    router.push(RouteEnum.WalletDeposit);
  }, [router]);

  return (
    <Button variant="outline" size="icon" aria-label="Deposit" onClick={handleDeposit}>
      <Icons.banknoteArrowUp className="h-4 w-4" />
    </Button>
  );
};

export default WalletDepositButton;
