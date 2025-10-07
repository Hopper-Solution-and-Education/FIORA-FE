'use client';

import { SendingFXForm } from '@/features/sending/presentation/views';
import { PaymentWalletOverview, PaymentWalletTable } from '../organisms';

const PaymentWalletPage = () => {
  return (
    <div id="payment-wallet-page" className="space-y-6">
      <PaymentWalletOverview />
      <PaymentWalletTable />
      <SendingFXForm />
    </div>
  );
};

export default PaymentWalletPage;
