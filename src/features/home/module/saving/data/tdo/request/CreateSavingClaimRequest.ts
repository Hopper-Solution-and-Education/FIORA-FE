type WalletType = 'Payment' | 'Saving';

export type CreateSavingClaimRequest = {
  packageFXId: string;
  walletType: WalletType;
};
