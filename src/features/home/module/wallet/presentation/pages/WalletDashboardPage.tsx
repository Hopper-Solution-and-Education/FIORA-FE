'use client';

import { WalletBarChart, WalletOverview, WalletTopbarAction } from '../organisms';

const WalletDashboardPage = () => {
  return (
    <div id="wallet-dashboard">
      <WalletTopbarAction />
      <WalletOverview />
      <WalletBarChart />
    </div>
  );
};

export default WalletDashboardPage;
