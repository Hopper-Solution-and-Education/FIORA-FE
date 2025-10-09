'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { setWithdrawFXFormClose, setWithdrawFXFormOpen } from '@/features/home/module/wallet';
import { useAppDispatch } from '@/store';
import { useCallback, useEffect } from 'react';

const WalletWithdrawButton = () => {
  const dispatch = useAppDispatch();

  const handleDeposit = useCallback(() => {
    dispatch(setWithdrawFXFormOpen());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setWithdrawFXFormClose());
  }, []);

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
            <Icons.banknoteArrowDown className="!h-6 !w-6 text-red-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Withdraw</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WalletWithdrawButton;
