'use client';

import { Loading } from '@/components/common/atoms';
import MetricCard from '@/components/common/metric/MetricCard';
import { useAppSelector } from '@/store';
import { useEffect, useState } from 'react';
import { CreateDepositRequest } from '../../data/tdo/request/CreateDepositRequest';
import useFetchDataOverview from '../../hooks/useFetchDataOverview';
import { ISavingWallet } from '../../types';
import { SavingClaimButton, SavingDepositButton, SavingTransferButton } from '../atoms';
import { SavingDepositPage } from '../pages';

type DepositPageStatus = 'deposit' | 'transfer' | 'claim';
type TitleDeposit = {
  title: string;
  subtitle?: string;
};
type ChildProps = {
  walletId: string;
};

const SavingOverview = ({ walletId }: ChildProps) => {
  const { wallets } = useAppSelector((state) => state.wallet);
  const { data, loading, error } = useFetchDataOverview(walletId);
  const [showDepositPage, setShowDepositPage] = useState<DepositPageStatus | null>(null);
  const [transferRequest, setTransferRequest] = useState<CreateDepositRequest | null>(null);
  const [savingWallets, setSavingWallets] = useState<ISavingWallet[]>([]);
  const [titleDepositPage, setTitleDepositPage] = useState<TitleDeposit | null>(null);

  useEffect(() => {
    if (wallets && wallets.length > 0) {
      const filteredWallet = wallets.reduce<ISavingWallet[]>((acc, wallet) => {
        if (showDepositPage === 'claim') {
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

    if (showDepositPage === 'deposit') {
      setTitleDepositPage({
        title: 'TOP-UP',
        subtitle: 'Transfer money from payment wallet to savings',
      });
    } else if (showDepositPage === 'transfer') {
      setTitleDepositPage({
        title: 'TRANSFER',
        subtitle: 'Claim the principal amount from savings wallet to payment wallet',
      });
    } else if (showDepositPage === 'claim') {
      setTitleDepositPage({
        title: 'CLAIM',
        subtitle: 'Interest from savings is added to principal or withdrawn to payment wallet',
      });
    }
  }, [showDepositPage]);

  useEffect(() => {
    if (transferRequest) {
      console.log('Transfer Request: ', transferRequest);
    }
  }, [transferRequest]);

  if (!data) return <p>No data</p>;
  if (loading) {
    return <Loading />;
  }
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 pb-4">
        <MetricCard
          title="Total FX Moved In"
          value={+data.data.wallet.balance + +data.data.moveInBalance}
          type="income"
          icon="banknoteArrowUp"
          className="h-fit p-3 pb-2 *:px-3 *:py-0"
        />

        <MetricCard
          title="Total FX Moved Out"
          value={data.data.moveOutBalance}
          type="expense"
          icon="banknoteArrowDown"
          className="h-fit p-3 pb-2 *:px-3 *:py-0"
        />

        <MetricCard
          title="Saving Interest"
          value={data.data.benefit.value}
          type="default"
          icon="percent"
          className="h-fit p-3 pb-2 *:px-3 *:py-0"
          classNameCustomCardColor="text-pink-600 dark:text-pink-400"
          currency="%"
        />

        <div className="flex items-end justify-end gap-2">
          <SavingDepositButton click={() => setShowDepositPage('deposit')} />
          <SavingTransferButton click={() => setShowDepositPage('transfer')} />
          <SavingClaimButton click={() => setShowDepositPage('claim')} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pb-6">
        <MetricCard
          title="Current Balance"
          value={data.data.wallet.balance}
          type="total"
          icon="landmark"
          description="Total FX Balance"
        />

        <MetricCard
          title="Current Reward"
          value={data.data.wallet.availableReward}
          type="expense"
          icon="handCoins"
          classNameCustomCardColor="text-yellow-600 dark:text-yellow-400"
          description="Total Available FX For Trading"
        />

        <MetricCard
          title="Current Reward Claimed"
          value={data.data.wallet.claimsedReward}
          type="default"
          icon="handCoins"
          description="Total FX Being Processed"
        />

        <MetricCard
          title="Total Reward"
          value={data.data.wallet.accumReward}
          type="income"
          icon="handCoins"
          description="Total FX Being Processed"
        />
      </div>

      <SavingDepositPage
        title={titleDepositPage?.title ?? ''}
        subTitle={titleDepositPage?.subtitle}
        wallets={savingWallets}
        submit={(request: CreateDepositRequest) => setTransferRequest(request)}
        isOpen={showDepositPage !== null}
        handleClose={() => setShowDepositPage(null)}
      />
    </>
  );
};

export default SavingOverview;
