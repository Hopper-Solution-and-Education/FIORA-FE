export enum SavingTransactionStatus {
  DEPOSIT = 'Deposit',
  TRANSFER = 'Transfer',
  CLAIM = 'Claim',
}

export enum SavingWalletType {
  PAYMENT = 'Payment',
  SAVING = 'Saving',
}

export enum SavingTransactionTableToEntity {
  'No.' = 'no',
  Date = 'date',
  Type = 'type',
  Amount = 'amount',
  From = 'fromWallet',
  To = 'toWallet',
  Remark = 'remark',
  Actions = 'actions',
}

export enum SavingMatchWalletName {
  Payment = 'Payment',
  Saving = 'Saving Principal',
}
