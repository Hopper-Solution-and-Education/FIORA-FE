'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { DollarSign, Home, TrendingUp } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { setFilter, triggerRefresh } from '../../slices';
import {
  useGetReferralEarningsQuery,
  useInviteByEmailsMutation,
  useLazyGetReferralUsersQuery,
  useWithdrawMutation,
} from '../../slices/referralApi';
import type { ReferralTransactionType } from '../../types';
import { ReferralStatsCard } from '../atoms';
import {
  ReferralCodeCard,
  ReferralInviteDialog,
  ReferralRefereeListDialog,
  ReferralTransactionTable,
  ReferralWithdrawDialog,
} from '../organisms';

const formatNumber = (value: string | number | undefined | null) => {
  const parsed = Number(value ?? 0);
  if (Number.isNaN(parsed)) {
    return '0';
  }
  return parsed.toLocaleString();
};

const DEFAULT_REFEREE_PARAMS = { page: 1, limit: 50 } as const;

const ReferralUIPage = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.referralTransaction.filter);

  const { data: earnings, isLoading: earningsLoading } = useGetReferralEarningsQuery();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [refereeListOpen, setRefereeListOpen] = useState(false);

  const [inviteByEmails, { isLoading: inviteLoading }] = useInviteByEmailsMutation();
  const [withdrawReferral, { isLoading: withdrawLoading }] = useWithdrawMutation();
  const [fetchReferees, refereesQuery] = useLazyGetReferralUsersQuery();

  const referees = refereesQuery.data?.data ?? [];
  const refereesLoading = refereesQuery.isFetching || refereesQuery.isLoading;

  const availableBalance = useMemo(() => {
    const raw = earnings?.remainingBalance ?? 0;
    const parsed = Number(raw);
    return Number.isNaN(parsed) ? 0 : parsed;
  }, [earnings?.remainingBalance]);

  const activeType = useMemo<ReferralTransactionType | null>(() => {
    return Array.isArray(filter.type) && filter.type.length === 1 ? filter.type[0] : null;
  }, [filter.type]);

  const isIncomeFilterActive = activeType === 'Income';
  const isTransferFilterActive = activeType === 'Transfer';

  const handleTransactionFilterChange = useCallback(
    (transactionType: ReferralTransactionType) => {
      const shouldClear =
        Array.isArray(filter.type) &&
        filter.type.length === 1 &&
        filter.type[0] === transactionType;

      dispatch(
        setFilter({
          ...filter,
          type: shouldClear ? null : [transactionType],
        }),
      );
    },
    [dispatch, filter],
  );

  const handleInvite = useCallback(
    async (emails: string[]) => {
      try {
        const response = await inviteByEmails({ emails }).unwrap();
        const created = Array.isArray(response?.created) ? response.created : [];
        const duplicates = Array.isArray(response?.duplicates) ? response.duplicates : [];

        if (created.length) {
          toast.success(`Sent ${created.length} invitation${created.length === 1 ? '' : 's'}.`);
        }
        if (duplicates.length) {
          toast.warning(`These emails were already invited: ${duplicates.join(', ')}`);
        }

        if (refereeListOpen) {
          fetchReferees(DEFAULT_REFEREE_PARAMS);
        }

        return { createdEmails: created, duplicateEmails: duplicates };
      } catch (error: any) {
        const message = error?.data?.message || error?.message || 'Failed to send invitations.';
        toast.error(message);
        throw error;
      }
    },
    [inviteByEmails, refereeListOpen, fetchReferees],
  );

  const handleCheckExistingEmails = useCallback(
    async (emails: string[]) => {
      try {
        // Use the existing referrals query to check for existing emails
        const response = await fetchReferees({
          page: 1,
          limit: 1000, // Get a large number to check all
        }).unwrap();

        const existingEmails = new Set<string>();
        response.data?.forEach((referee) => {
          if (referee.email) {
            existingEmails.add(referee.email.toLowerCase());
          }
        });

        // Return emails that already exist
        return emails.filter((email) => existingEmails.has(email.toLowerCase()));
      } catch (error: any) {
        const message =
          error?.data?.message || error?.message || 'Failed to check existing emails.';
        toast.error(message);
        throw error;
      }
    },
    [fetchReferees],
  );

  const handleWithdraw = useCallback(
    async (amount: number) => {
      try {
        await withdrawReferral({ amount }).unwrap();
        toast.success(`Withdrawal of ${amount.toLocaleString()} FX requested successfully.`);
        dispatch(triggerRefresh());
      } catch (error: any) {
        const message =
          error?.data?.message || error?.message || 'Unable to process withdrawal right now.';
        toast.error(message);
        throw error;
      }
    },
    [withdrawReferral, dispatch],
  );

  const handleViewReferees = useCallback(() => {
    setRefereeListOpen(true);
    fetchReferees(DEFAULT_REFEREE_PARAMS);
  }, [fetchReferees]);

  const handleRefereeDialogChange = useCallback(
    (next: boolean) => {
      setRefereeListOpen(next);
      if (next) {
        fetchReferees(DEFAULT_REFEREE_PARAMS);
      }
    },
    [fetchReferees],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6">
      <ReferralCodeCard
        referralCode={earnings?.referralCode ?? null}
        onInviteClick={() => setInviteOpen(true)}
        onWithdrawClick={() => setWithdrawOpen(true)}
        onViewReferees={handleViewReferees}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <ReferralStatsCard
          title="Total Earned"
          value={formatNumber(earnings?.totalEarned)}
          currency="FX"
          description="Total income from referral program"
          icon={<TrendingUp className="h-5 w-5" />}
          isLoading={earningsLoading}
          tone="green"
          onClick={() => handleTransactionFilterChange('Income')}
          isActive={isIncomeFilterActive}
        />
        <ReferralStatsCard
          title="Total Claims"
          value={formatNumber(earnings?.totalClaims)}
          currency="FX"
          description="Total amount withdrawn from referral wallet"
          icon={<DollarSign className="h-5 w-5" />}
          isLoading={earningsLoading}
          tone="gray"
          onClick={() => handleTransactionFilterChange('Transfer')}
          isActive={isTransferFilterActive}
        />
        <ReferralStatsCard
          title="Remaining Balance"
          value={formatNumber(earnings?.remainingBalance)}
          currency="FX"
          description="Remaining amount"
          icon={<Home className="h-5 w-5" />}
          isLoading={earningsLoading}
          tone="red"
        />
      </section>

      <ReferralTransactionTable />

      <ReferralInviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={handleInvite}
        onCheckExistingEmails={handleCheckExistingEmails}
        isSubmitting={inviteLoading}
      />

      <ReferralWithdrawDialog
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        onWithdraw={handleWithdraw}
        isSubmitting={withdrawLoading}
        availableBalance={availableBalance}
        minimumThreshold={100}
      />

      <ReferralRefereeListDialog
        open={refereeListOpen}
        onOpenChange={handleRefereeDialogChange}
        referees={referees}
        isLoading={refereesLoading}
        onInviteMore={() => setInviteOpen(true)}
      />
    </div>
  );
};

export default ReferralUIPage;
