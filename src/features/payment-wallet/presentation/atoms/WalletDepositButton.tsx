'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const WalletDepositButton = () => {
  const router = useRouter();

  const handleDeposit = useCallback(() => {
    router.push(RouteEnum.WalletDeposit);
  }, [router]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Deposit"
            onClick={handleDeposit}
            className="h-fit w-fit !px-4 !py-2"
          >
            <Icons.banknoteArrowUp className="!h-6 !w-6 text-green-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Deposit</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WalletDepositButton;
