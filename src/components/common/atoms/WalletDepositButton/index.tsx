'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { RouteEnum } from '@/shared/constants';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const WalletDepositButton = () => {
  const router = useRouter();

  const handleDeposit = useCallback(() => {
    router.push(RouteEnum.WalletDeposit);
  }, [router]);

  return (
    <CommonTooltip content="Deposit">
      <Button
        variant="outline"
        size="icon"
        aria-label="Deposit"
        onClick={handleDeposit}
        className="h-fit w-fit !px-4 !py-2"
      >
        <Icons.banknoteArrowUp className="!h-6 !w-6 text-green-600" />
      </Button>
    </CommonTooltip>
  );
};

export default WalletDepositButton;
