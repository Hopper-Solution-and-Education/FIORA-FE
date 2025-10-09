'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store';
import { useCallback, useEffect } from 'react';
import { setWithdrawFXFormClose, setWithdrawFXFormOpen } from '../../slices';

const WalletWithdrawButton = () => {
  const dispatch = useAppDispatch();

  const handleDeposit = useCallback(() => {
    dispatch(setWithdrawFXFormOpen());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(setWithdrawFXFormClose());
    };
  }, []);

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
