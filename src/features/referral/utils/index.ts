import type { ReferralEarnings, ReferralTransaction, ReferralUser } from '../types';

// Build query string from optional params
export const toQueryString = (params: Record<string, string | number | undefined>) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  });
  const s = qs.toString();
  return s ? `?${s}` : '';
};

// Map server referral item to UI model
export const mapReferralItem = (r: any): ReferralUser => ({
  id: r.id,
  email: r.refereeEmail,
  status: r.status === 'eKYC_COMPLETED' ? 'COMPLETED' : r.status,
  joinedAt: r.createdAt,
  eKycStatus: r.status === 'eKYC_COMPLETED' ? 'VERIFIED' : 'PENDING',
});

const formatWalletLabel = (
  wallet?: { name?: string | null; type?: string | null } | null,
): string => {
  if (wallet?.name) return wallet.name;
  if (wallet?.type) return `${wallet.type} Wallet`;
  return '';
};

// Map server transactions to UI table items
export const mapTransactions = (rows: any[]): ReferralTransaction[] =>
  rows.map((t) => {
    const fromLabel = formatWalletLabel(t.fromWallet) || t.fromAccount?.name || '';
    const toLabel = formatWalletLabel(t.toWallet) || t.toAccount?.name || '';

    return {
      id: t.id,
      date: t.date,
      type: t.type,
      amount: String(t.amount),
      from: fromLabel,
      to: toLabel,
      remark: t.remark || '',
      membershipBenefit: t.membershipBenefit,
    };
  });

// Map server dashboard numbers to UI strings
export const mapEarnings = (d: any): ReferralEarnings => ({
  totalEarned: String(d?.totalEarned ?? 0),
  totalClaims: String(d?.totalWithdrawn ?? 0),
  remainingBalance: String(d?.availableBalance ?? 0),
  referralCode: d?.referralCode ?? null,
});
