'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { setSendingFXFormClose, setSendingFXFormOpen } from '@/features/home/module/wallet';
import { useAppDispatch } from '@/store';
import { useCallback, useEffect } from 'react';

const WalletSendingButton = () => {
  const dispatch = useAppDispatch();

  const handleSending = useCallback(() => {
    dispatch(setSendingFXFormOpen());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSendingFXFormClose());
  }, [dispatch]);

  return (
    <CommonTooltip content="Sending" side="top" align="center">
      <Button
        variant="outline"
        size="icon"
        aria-label="Sending"
        onClick={handleSending}
        className="h-fit w-fit !px-4 !py-2"
      >
        <Icons.arrowRight className="!h-6 !w-6 text-green-600" />
      </Button>
    </CommonTooltip>
  );
};

export default WalletSendingButton;
