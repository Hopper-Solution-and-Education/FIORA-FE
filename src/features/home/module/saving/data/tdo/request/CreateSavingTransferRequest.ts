type ActionType = 'Deposit' | 'Transfer';

export type CreateSavingTransferRequest = {
  packageFXId: string;
  action: ActionType;
};
