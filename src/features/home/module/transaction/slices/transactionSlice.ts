import {
  IRelationalTransaction,
  ITransactionPaginatedResponse,
} from '@/features/home/module/transaction/types';
import { FilterCriteria } from '@/shared/types';
import { Response } from '@/shared/types/Common.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  deleteTransaction,
  fetchTransactions,
  getTransactionById,
  updateTransaction,
} from './actions';

interface TransactionState {
  transactions: {
    data: ITransactionPaginatedResponse | null;
    isLoading: boolean;
    error: string | null;
  };
  maxBalance: number;
  filterCriteria: FilterCriteria;
  deleteConfirmOpen: boolean;
  selectedTransaction: IRelationalTransaction | null;
}

const transactionSlice = createSlice({
  name: 'transactionData',
  initialState: {
    transactions: {
      data: null,
      isLoading: false,
      error: null,
    },
    maxBalance: 0,
    filterCriteria: {
      filters: {},
      userId: '',
      page: 1,
      pageSize: 10,
      sortBy: {},
    },
    deleteConfirmOpen: false,
    selectedTransaction: null,
  } as TransactionState,
  reducers: {
    setTransactions(state, action: PayloadAction<Response<ITransactionPaginatedResponse>>) {
      state.transactions.data = action.payload.data;
      state.transactions.isLoading = false;
      state.transactions.error = null;
    },
    setFilterCriteria(state, action: PayloadAction<FilterCriteria>) {
      state.filterCriteria = action.payload;
    },
    reset: () => ({
      transactions: {
        data: null,
        isLoading: false,
        error: null,
      },
      maxBalance: 0,
      filterCriteria: {
        filters: {},
        userId: '',
        page: 1,
        pageSize: 10,
        sortBy: {},
      },
      deleteConfirmOpen: false,
      selectedTransaction: null,
    }),
    setDeleteConfirmOpen(state, action: PayloadAction<boolean>) {
      state.deleteConfirmOpen = action.payload;
    },
    setSelectedTransaction(state, action: PayloadAction<IRelationalTransaction | null>) {
      state.selectedTransaction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.transactions.isLoading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions.isLoading = false;
        state.transactions.data = action.payload.data;
        if (state.maxBalance === 0 && action.payload.data.amountMax) {
          state.maxBalance = action.payload.data.amountMax;
        }
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.transactions.isLoading = false;
        state.transactions.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.transactions.isLoading = true;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions.isLoading = false;
        if (state.transactions.data?.data) {
          state.transactions.data.data = state.transactions.data.data.filter(
            (trans) => trans.id !== action.payload,
          );
        }
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.transactions.isLoading = false;
        state.transactions.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      })
      .addCase(getTransactionById.pending, (state) => {
        state.transactions.isLoading = true;
      })
      .addCase(getTransactionById.fulfilled, (state, action) => {
        state.transactions.isLoading = false;
        const newTransaction = action.payload.data as unknown as IRelationalTransaction;
        if (state.transactions.data?.data) {
          state.transactions.data.data.push(newTransaction);
        } else {
          state.transactions.data = {
            data: [newTransaction],
            amountMin: 0,
            amountMax: 0,
            page: 1,
            pageSize: 10,
            totalPage: 1,
            total: 1,
          };
        }
      })
      .addCase(getTransactionById.rejected, (state, action) => {
        state.transactions.isLoading = false;
        state.transactions.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.transactions.isLoading = false;
        if (state.transactions.data?.data) {
          const updatedTransaction = action.payload.data as unknown as IRelationalTransaction;
          const index = state.transactions.data.data.findIndex(
            (trans: any) => trans.id === (updatedTransaction as any).id,
          );
          if (index !== -1) {
            state.transactions.data.data[index] = updatedTransaction;
          }
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.transactions.isLoading = false;
        state.transactions.error =
          (action.payload as { message: string })?.message || 'Unknown error';
      });
  },
});

export const {
  setDeleteConfirmOpen,
  setSelectedTransaction,
  setTransactions,
  setFilterCriteria,
  reset,
} = transactionSlice.actions;
export default transactionSlice.reducer;
