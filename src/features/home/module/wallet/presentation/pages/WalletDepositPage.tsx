import React, { useState } from 'react';
import WalletPackageList from '../organisms/WalletPackageList';
import { WalletTopbarAction } from '../organisms';

const WalletDepositPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div id="wallet-deposit">
      <div className="max-w-7xl mx-auto">
        <WalletTopbarAction enableDeposit={false} enableFilter={false} />

        <div className="flex gap-6 pt-6 justify-center">
          <WalletPackageList selectedId={selectedId} setSelectedId={setSelectedId} />
          <div className="flex-1">{/* TODO: Deposit form UI */}</div>
        </div>
      </div>
    </div>
  );
};

export default WalletDepositPage;
