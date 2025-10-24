'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
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
    <CommonTooltip content="Withdraw">
      <Button
        variant="outline"
        size="icon"
        aria-label="Deposit"
        onClick={handleDeposit}
        className="h-fit w-fit !px-4 !py-2"
      >
        <Icons.banknoteArrowDown className="!h-6 !w-6 text-red-600" />
      </Button>
    </CommonTooltip>
  );
};

export default WalletWithdrawButton;
