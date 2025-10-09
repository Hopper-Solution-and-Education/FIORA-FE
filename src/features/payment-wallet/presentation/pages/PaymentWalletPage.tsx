'use client';

import { WithdrawFXForm } from '@/features/wallet-withdraw/presentation/views';
import { PaymentWalletOverview, PaymentWalletTable } from '../organisms';

const PaymentWalletPage = () => {
  return (
    <div id="payment-wallet-page" className="space-y-6">
      <PaymentWalletOverview />
      <PaymentWalletTable />
      <WithdrawFXForm />
    </div>
  );
};

export default PaymentWalletPage;
