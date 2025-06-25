import { WalletDepositButton, WalletFilterButton } from '../atoms';
import { WalletSearch } from '../molecules';

const WalletTopbarAction = () => {
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

export default WalletTopbarAction;
