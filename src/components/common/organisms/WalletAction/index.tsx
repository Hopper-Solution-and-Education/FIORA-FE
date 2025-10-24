'use client';

import {
  WalletDepositButton,
  WalletTransferButton,
  WalletWithdrawButton,
} from '@/components/common/atoms';
import { WithdrawFXForm } from '@/features/wallet-withdraw/presentation/views';

const WalletAction = ({
  enableDeposit = true,
  enableTransfer = true,
  enableWithdraw = true,
}: {
  enableDeposit?: boolean;
  enableTransfer?: boolean;
  enableWithdraw?: boolean;
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        {enableDeposit && <WalletDepositButton />}
        {enableTransfer && <WalletTransferButton />}
        {enableWithdraw && <WalletWithdrawButton />}
      </div>
      <WithdrawFXForm />
    </>
  );
};

export default WalletAction;
