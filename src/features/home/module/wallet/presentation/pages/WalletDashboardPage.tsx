'use client';

import { SendingFXForm } from '@/features/sending/presentation/views';
import { WithdrawFXForm } from '@/features/wallet-withdraw/presentation/views';
import { WalletBarChart, WalletOverview, WalletTopbarAction } from '../organisms';

const WalletDashboardPage = () => {
  return (
    <div id="wallet-dashboard">
      <WalletTopbarAction />
      <WalletOverview />
      <WalletBarChart />
      <SendingFXForm />
      <WithdrawFXForm />
    </div>
  );
};

export default WalletDashboardPage;
