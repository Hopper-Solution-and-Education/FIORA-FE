'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { setSendingFXFormClose, setSendingFXFormOpen } from '@/features/home/module/wallet';
import { useAppDispatch } from '@/store';
import { useCallback, useEffect } from 'react';

const WalletTransferButton = () => {
  const dispatch = useAppDispatch();

  const handleSending = useCallback(() => {
    dispatch(setSendingFXFormOpen());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSendingFXFormClose());
  }, []);

  return (
    <CommonTooltip content="Sending">
      <Button
        variant="outline"
        size="icon"
        aria-label="Deposit"
        onClick={handleSending}
        className="h-fit w-fit !px-[1.20rem] !py-2.5"
      >
        <Icons.arrowLeftRight className="!h-5 !w-5 text-orange-600" />
      </Button>
    </CommonTooltip>
  );
};

export default WalletTransferButton;
