'use client';

import { PaymentWalletOverview, PaymentWalletTable } from '../organisms';

const PaymentWalletPage = () => {
  return (
    <div id="payment-wallet-page" className="space-y-6">
      <PaymentWalletOverview />
      <PaymentWalletTable />
    </div>
  );
};

export default PaymentWalletPage;
