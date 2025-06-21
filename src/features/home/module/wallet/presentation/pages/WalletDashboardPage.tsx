import React from 'react';
import { WalletTopbarAction } from '../molecules/WalletTopbarAcion';

const WalletDashboardPage = () => {
  return (
    <section id="wallet-dashboard" className="space-y-6 px-4">
      <div>
        <WalletTopbarAction />
      </div>
    </section>
  );
};

export default WalletDashboardPage;
