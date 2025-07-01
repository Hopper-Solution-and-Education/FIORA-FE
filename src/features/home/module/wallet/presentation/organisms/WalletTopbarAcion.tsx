'use client';

import { WalletDepositButton } from '../atoms';
import { WalletSearch, WalletFilterMenu } from '../molecules';
import { useAppSelector, useAppDispatch } from '@/store';
import { setFilterCriteria } from '../../slices';
import { FilterCriteria } from '@/shared/types';

interface WalletTopbarActionProps {
  enableDeposit?: boolean;
  enableFilter?: boolean;
}

const WalletTopbarAction = ({
  enableDeposit = true,
  enableFilter = true,
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
        <WalletSearch />

        {enableFilter && (
          <WalletFilterMenu
            filterCriteria={filterCriteria}
            onFilterChange={handleFilterChange}
            minBalance={minBalance ?? undefined}
            maxBalance={maxBalance ?? undefined}
          />
        )}
      </div>
      {enableDeposit && <WalletDepositButton />}
    </div>
  );
};

export default WalletTopbarAction;
