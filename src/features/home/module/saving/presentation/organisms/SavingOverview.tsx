'use client';

import { Loading } from '@/components/common/atoms';
import MetricCard from '@/components/common/metric/MetricCard';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import { createSavingTransaction, getSavingWalletById } from '../../slices/actions';
import { ActionType, ISavingWallet, SavingTransaction } from '../../types';
import { SavingTransactionStatus } from '../../utils/enums';
import { SavingClaimButton, SavingDepositButton, SavingTransferButton } from '../atoms';
import { SavingDepositPage } from '../pages';

type TitleDeposit = {
  title: string;
  subtitle?: string;
};
type ChildProps = {
  walletId: string;
};

const SavingOverview = ({ walletId }: ChildProps) => {
  const dispatch = useAppDispatch();
  const { wallets } = useAppSelector((state) => state.wallet);
  const { overview, loading, error, refetchTrigger, isCreateTransactionLoading } = useAppSelector(
    (state) => state.savingWallet,
  );
  const [showDepositPage, setShowDepositPage] = useState<ActionType | null>(null);
  const [transactionRequest, setTransactionRequest] = useState<SavingTransaction | null>(null);
  const [savingWallets, setSavingWallets] = useState<ISavingWallet[]>([]);
  const [titleDepositPage, setTitleDepositPage] = useState<TitleDeposit | null>(null);

  useEffect(() => {
    dispatch(getSavingWalletById(walletId));
  }, [dispatch, walletId, refetchTrigger]);

  useEffect(() => {
    if (transactionRequest) {
      dispatch(createSavingTransaction(transactionRequest));
    }
  }, [transactionRequest]);

  useEffect(() => {
    if (wallets && wallets.length > 0) {
      const filteredWallet = wallets.reduce<ISavingWallet[]>((acc, wallet) => {
        if (showDepositPage === SavingTransactionStatus.CLAIM) {
          if (wallet.type.toLowerCase().includes('payment')) {
            acc.push({ id: wallet.id, name: 'Payment', type: wallet.type });
          } else if (wallet.type.toLowerCase().includes('saving')) {
            acc.push({ id: wallet.id, name: 'Saving Principal', type: wallet.type });
          }
        } else {
          if (wallet.type.toLowerCase().includes('payment')) {
            acc.push({ id: wallet.id, name: 'Payment', type: wallet.type });
          }
        }
        return acc;
      }, []);

      setSavingWallets(filteredWallet);
    }
  }, [wallets, showDepositPage]);

  useEffect(() => {
    if (showDepositPage === null) return;

    if (showDepositPage === SavingTransactionStatus.DEPOSIT) {
      setTitleDepositPage({
        title: 'TOP-UP',
        subtitle: 'Transfer money from payment wallet to savings',
      });
    } else if (showDepositPage === SavingTransactionStatus.TRANSFER) {
      setTitleDepositPage({
        title: 'TRANSFER',
        subtitle: 'Claim the principal amount from savings wallet to payment wallet',
      });
    } else if (showDepositPage === SavingTransactionStatus.CLAIM) {
      setTitleDepositPage({
        title: 'CLAIM',
        subtitle: 'Interest from savings is added to principal or withdrawn to payment wallet',
      });
    }
  }, [showDepositPage]);

  useEffect(() => {
    if (!showDepositPage) {
      setTransactionRequest(null);
    }
  }, [showDepositPage]);

  useEffect(() => {
    if (!error && showDepositPage !== null && transactionRequest !== null) {
      setShowDepositPage(null);
    }
  }, [error, showDepositPage, transactionRequest]);

  useEffect(() => {
    return () => {
      setTransactionRequest(null);
      setShowDepositPage(null);
    };
  }, []);

  if (!overview) return <></>;
  if ((loading && !overview) || isCreateTransactionLoading) {
    return <Loading />;
  }
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 pb-4">
        <MetricCard
          title="Total FX Moved In"
          value={+overview.data.wallet.balance + +overview.data.moveInBalance}
          type="income"
          icon="banknoteArrowUp"
          className="h-fit p-3 pb-2 *:px-3 *:py-0"
        />

        <MetricCard
          title="Total FX Moved Out"
          value={overview.data.moveOutBalance}
          type="expense"
          icon="banknoteArrowDown"
          className="h-fit p-3 pb-2 *:px-3 *:py-0"
        />

        <MetricCard
          title="Rate Of Benefit"
          value={overview.data.benefit.value}
          type="default"
          icon="percent"
          className="h-fit p-3 pb-2 *:px-3 *:py-0"
          classNameCustomCardColor="text-pink-600 dark:text-pink-400"
          currency="%"
          currencyPosition="right"
        />

        <div className="flex items-end justify-end gap-2">
          <SavingDepositButton click={() => setShowDepositPage('Deposit')} />
          <SavingTransferButton click={() => setShowDepositPage('Transfer')} />
          <SavingClaimButton click={() => setShowDepositPage('Claim')} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pb-6">
        <MetricCard
          title="Current Balance"
          value={overview.data.wallet.balance}
          type="total"
          icon="landmark"
          description="Total FX Balance"
        />

        <MetricCard
          title="Current Reward"
          value={overview.data.wallet.availableReward}
          type="expense"
          icon="handCoins"
          classNameCustomCardColor="text-yellow-600 dark:text-yellow-400"
          description="Total Available FX For Trading"
        />

        <MetricCard
          title="Current Reward Claim"
          value={overview.data.wallet.claimsedReward}
          type="default"
          icon="handCoins"
          description="Total FX Being Processed"
        />

        <MetricCard
          title="Total Reward"
          value={overview.data.wallet.accumReward}
          type="income"
          icon="handCoins"
          description="Total FX Being Processed"
        />
      </div>

      <SavingDepositPage
        title={titleDepositPage?.title ?? ''}
        subTitle={titleDepositPage?.subtitle}
        wallets={savingWallets}
        state={showDepositPage}
        submit={(request: SavingTransaction) => setTransactionRequest(request)}
        isOpen={showDepositPage !== null}
        handleClose={() => setShowDepositPage(null)}
      />
    </>
  );
};

export default SavingOverview;
