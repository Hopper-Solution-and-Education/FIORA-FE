import { WalletDepositButton } from '../atoms/WalletDepositButton';
import { WalletFilterButton } from '../atoms/WalletFilterButton';
import { WalletSearch } from '../atoms/WalletSearch';

export const WalletTopbarAction = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <WalletSearch />
        <WalletFilterButton />
      </div>
      <WalletDepositButton />
    </div>
  );
};
