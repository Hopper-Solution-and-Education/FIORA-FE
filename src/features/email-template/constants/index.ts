export const SEND_TO_OPTIONS = [
  { id: 'all', label: 'ALL' },
  { id: 'admin', label: 'Admin' },
  { id: 'cs', label: 'CS' },
  { id: 'personal', label: 'Personal' },
] as const;

export const EMAIL_TEMPLATES = [
  { id: 'kyc-support', name: 'KYC Support Template', type: 'System Default', color: 'green' },
  { id: 'deposit-confirmation', name: 'Deposit Confirmation', type: 'System', color: 'green' },
  { id: 'welcome-message', name: 'Welcome Message', type: '', color: '' },
  { id: 'referral-bonus', name: 'Referral Bonus', type: 'Marketing', color: 'purple' },
  { id: 'invitation-new-customer', name: 'Invitation New Customer', type: '', color: '' },
  { id: 'account-verification', name: 'Account Verification', type: 'System', color: 'green' },
] as const;

export const TEMPLATE_TYPES = ['Deposit', 'Withdrawal', 'KYC', 'Marketing', 'System'] as const;
