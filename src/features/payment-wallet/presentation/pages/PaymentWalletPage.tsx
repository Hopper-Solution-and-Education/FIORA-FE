'use client';

import { SendingFXForm } from '@/features/sending';
import { WithdrawFXForm } from '@/features/wallet-withdraw/presentation/views';
import { PaymentWalletOverview, PaymentWalletTable } from '../organisms';

const PaymentWalletPage = () => {
  return (
    <div id="payment-wallet-page" className="space-y-6">
      <PaymentWalletOverview />
      <PaymentWalletTable />
      <SendingFXForm />
      <WithdrawFXForm />
    </div>
  );
};

export default PaymentWalletPage;
