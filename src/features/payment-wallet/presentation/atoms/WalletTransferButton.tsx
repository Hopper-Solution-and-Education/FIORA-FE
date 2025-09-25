'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const WalletTransferButton = () => {
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
            className="h-fit w-fit !px-[1.20rem] !py-2.5"
          >
            <Icons.arrowLeftRight className="!h-5 !w-5 text-orange-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Transfer</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WalletTransferButton;
