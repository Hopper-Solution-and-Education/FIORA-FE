'use client';

import { WalletTransferButton } from '@/features/payment-wallet/presentation';
import { FilterCriteria } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFilterCriteria } from '../../slices';
import { WalletDepositButton, WalletWithdrawButton } from '../atoms';
import { WalletFilterMenu, WalletSearch } from '../molecules';

interface WalletTopbarActionProps {
  enableDeposit?: boolean;
  enableTranfer?: boolean;
  enableWithdraw?: boolean;
  enableFilter?: boolean;
  searchType?: 'normal' | 'deposit';
}

const WalletTopbarAction = ({
  enableDeposit = true,
  enableTranfer = true,
  enableWithdraw = true,
  enableFilter = true,
  searchType = 'normal',
}: WalletTopbarActionProps) => {
  const filterCriteria = useAppSelector((state) => state.wallet.filterCriteria);
  const minBalance = useAppSelector((state) => state.wallet.minBalance);
  const maxBalance = useAppSelector((state) => state.wallet.maxBalance);

  const dispatch = useAppDispatch();

  const handleFilterChange = (newFilter: FilterCriteria) => {
    dispatch(setFilterCriteria(newFilter));
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <WalletSearch searchType={searchType} />
        {enableFilter && searchType === 'normal' && (
          <WalletFilterMenu
            filterCriteria={filterCriteria}
            onFilterChange={handleFilterChange}
            minBalance={minBalance ?? undefined}
            maxBalance={maxBalance ?? undefined}
          />
        )}
      </div>
      <div className="flex justify-end gap-4">
        {enableDeposit && <WalletDepositButton />}
        {enableTranfer && <WalletTransferButton />}
        {enableWithdraw && <WalletWithdrawButton />}
      </div>
    </div>
  );
};

export default WalletTopbarAction;
