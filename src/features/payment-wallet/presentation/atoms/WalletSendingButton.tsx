'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { setSendingFXFormClose, setSendingFXFormOpen } from '@/features/home/module/wallet/';
import { useAppDispatch } from '@/store';
import { useCallback, useEffect } from 'react';

const WalletSendingButton = () => {
  const dispatch = useAppDispatch();

  const handleSending = useCallback(() => {
    dispatch(setSendingFXFormOpen());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSendingFXFormClose());
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Sending"
            onClick={handleSending} // mở modal
            className="h-fit w-fit !px-4 !py-2"
          >
            <Icons.arrowRight className="!h-6 !w-6 text-green-600" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Sending</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default WalletSendingButton;
