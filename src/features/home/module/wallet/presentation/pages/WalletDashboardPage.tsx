'use client';

import { SendingFXForm } from '@/features/sending/presentation/views';
import { WalletBarChart, WalletOverview, WalletTopbarAction } from '../organisms';

const WalletDashboardPage = () => {
  return (
    <div id="wallet-dashboard">
      <WalletTopbarAction />
      <WalletOverview />
      <WalletBarChart />
      <SendingFXForm />
    </div>
  );
};

export default WalletDashboardPage;
