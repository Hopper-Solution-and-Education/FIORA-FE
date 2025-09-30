import { createAsyncThunk } from '@reduxjs/toolkit';
import { SavingApi } from '../../data/api';
import { SavingHistoryResponse } from '../../data/tdo/response/SavingHistoryResponse';
import { SavingOverviewResponse } from '../../data/tdo/response/SavingOverviewResponse';
import { SavingTransactionResponse } from '../../data/tdo/response/SavingTransactionResponse';
import { ISavingTransactionFilter, SavingTransaction } from '../../types';
import { SavingTransactionStatus, SavingWalletType } from '../../utils/enums';

const savingApi = new SavingApi();

// Lấy Overview
export const getSavingWalletById = createAsyncThunk<
  SavingOverviewResponse,
  string,
  { rejectValue: { message: string } }
>('savingWallet/getById', async (id, { rejectWithValue }) => {
  try {
    return await savingApi.getSavingWalletOverview(id);
  } catch (error: any) {
    return rejectWithValue({ message: error.message || 'Failed to fetch wallet overview' });
  }
});

// Lấy Saving Wallet Transaction History
export const fetchSavingTransactions = createAsyncThunk<
  SavingHistoryResponse,
  ISavingTransactionFilter,
  { rejectValue: { message: string } }
>('savingWallet/fetchTransactions', async (filter, { rejectWithValue }) => {
  try {
    return await savingApi.getSavingTransactionHistory(filter);
  } catch (error: any) {
    return rejectWithValue({ message: error.message || 'Failed to fetch transaction history' });
  }
});

// Thực hiện Transaction (Deposit / Transfer / Claim)
export const createSavingTransaction = createAsyncThunk<
  SavingTransactionResponse,
  SavingTransaction,
  { rejectValue: { message: string } }
>('savingWallet/createTransaction', async (payload, { rejectWithValue }) => {
  try {
    if (
      payload.action === SavingTransactionStatus.DEPOSIT ||
      payload.action === SavingTransactionStatus.TRANSFER
    ) {
      return await savingApi.createSavingTransfer({
        packageFXId: payload.packageFXId,
        action: payload.action,
      });
    } else if (payload.action === SavingTransactionStatus.CLAIM) {
      return await savingApi.createSavingClaim({
        packageFXId: payload.packageFXId,
        walletType: (payload.walletType as SavingWalletType) ?? SavingWalletType.PAYMENT,
      });
    }

    throw new Error('Unsupported action type');
  } catch (error: any) {
    return rejectWithValue({ message: error.message || 'Failed to create saving transaction' });
  }
});
