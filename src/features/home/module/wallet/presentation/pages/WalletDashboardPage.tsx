import React from 'react';
import { WalletTopbarAction } from '../organisms/WalletTopbarAcion';

const WalletDashboardPage = () => {
  return (
    <section className="container mx-auto sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6 sm:space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="flex-1">
          <WalletTopbarAction />
        </div>
      </div>
    </section>
  );
};

export default WalletDashboardPage;
