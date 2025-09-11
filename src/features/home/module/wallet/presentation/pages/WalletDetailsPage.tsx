'use client';

import { WalletDetailsOverview, WalletDetailsTable } from '../organisms';

const WalletDetailsPage = () => {
  return (
    <div id="wallet-details" className="space-y-6">
      <WalletDetailsOverview />
      <WalletDetailsTable />
    </div>
  );
};

export default WalletDetailsPage;
