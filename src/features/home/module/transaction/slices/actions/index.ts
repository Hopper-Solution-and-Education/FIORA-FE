import { ITransactionPaginatedResponse } from '@/features/home/module/transaction/types';
import transactionServices from '@/features/home/services/transactionServices';
import { Transaction } from '@/features/setting/module/product/domain/entities/Transaction';
import { FilterCriteria, Response } from '@/shared/types';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (filterCriteria: FilterCriteria, { rejectWithValue }) => {
    try {
      const response: Response<ITransactionPaginatedResponse> =
        await transactionServices.getFilteredTransactions(filterCriteria);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to fetch categories! Please try again!',
      });
    }
  },
);

export const deleteTransaction = createAsyncThunk(
  'transaction/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      await transactionServices.deleteTransaction(id);
      return id;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to delete transaction! Please try again!',
      });
    }
  },
);

export const getTransactionById = createAsyncThunk(
  'transaction/getTransactionById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: Response<Transaction> = await transactionServices.getTransactionById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to get transaction by id! Please try again!',
      });
    }
  },
);

export const updateTransaction = createAsyncThunk(
  'transaction/updateTransaction',
  async ({ id, data }: { id: string; data: Partial<Transaction> }, { rejectWithValue }) => {
    try {
      const response: Response<Transaction> = await transactionServices.updateTransaction(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.message || 'Failed to update transaction! Please try again!',
      });
    }
  },
);
