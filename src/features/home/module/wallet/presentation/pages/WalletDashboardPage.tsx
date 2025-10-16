'use client';

import { WithdrawFXForm } from '@/features/wallet-withdraw/presentation/views';
import { WalletBarChart, WalletOverview, WalletTopbarAction } from '../organisms';

const WalletDashboardPage = () => {
  return (
    <div id="wallet-dashboard">
      <WalletTopbarAction />
      <WalletOverview />
      <WalletBarChart />
      <WithdrawFXForm />
    </div>
  );
};

export default WalletDashboardPage;
