import { CreateTransactionBody } from '@/features/home/module/transaction/types';
import transactionServices from '@/features/home/services/transactionServices';
import { Transaction } from '@/features/setting/module/product/domain/entities/Transaction';
import { Response } from '@/shared/types';
import { Partner, Product, TransactionType } from '@prisma/client';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';

// Currency type based on API response
interface Currency {
  id: string;
  name: string;
  symbol: string;
}

// Async thunks
export const fetchPartners = createAsyncThunk<Partner[], void, { rejectValue: string }>(
  'createTransaction/fetchPartners',
  async (_, { rejectWithValue }) => {
    try {
      const response: Response<Partner[]> = await transactionServices.getPartners();
      return response.data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch partners';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'createTransaction/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response: Response<{ data: Product[] }> = await transactionServices.getProducts();
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch products';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchCurrencies = createAsyncThunk<Currency[], void, { rejectValue: string }>(
  'createTransaction/fetchCurrencies',
  async (_, { rejectWithValue }) => {
    try {
      const response: Response<Currency[]> = await transactionServices.getCurrencies();
      return response.data;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch currencies';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchSupportingData = createAsyncThunk<
  {
    fromAccounts: Array<{ id: string; name: string; type: string }>;
    toAccounts: Array<{ id: string; name: string; type: string }>;
    fromCategories: Array<{ id: string; name: string }>;
    toCategories: Array<{ id: string; name: string }>;
  },
  TransactionType,
  { rejectValue: string }
>('createTransaction/fetchSupportingData', async (type, { rejectWithValue }) => {
  try {
    const response = await transactionServices.getSupportingData(type);
    return response.data;
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to fetch supporting data';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

export const createTransaction = createAsyncThunk<
  Transaction,
  CreateTransactionBody,
  { rejectValue: string }
>('createTransaction/createTransaction', async (transactionData, { rejectWithValue }) => {
  try {
    const response: Response<Transaction> =
      await transactionServices.createTransaction(transactionData);
    toast.success(response.message || 'Transaction created successfully!');
    return response.data;
  } catch (error: any) {
    const errorMessage = error.message || 'Failed to create transaction';
    toast.error(errorMessage);
    return rejectWithValue(errorMessage);
  }
});

// Interface for the slice state
interface CreateTransactionState {
  partners: {
    data: Partner[];
    isLoading: boolean;
    error: string | null;
    hasFetched: boolean;
  };
  products: {
    data: Product[];
    isLoading: boolean;
    error: string | null;
    hasFetched: boolean;
  };
  currencies: {
    data: Currency[];
    isLoading: boolean;
    error: string | null;
    hasFetched: boolean;
  };
  supportingData: {
    data: {
      fromAccounts: Array<{ id: string; name: string; type: string }>;
      toAccounts: Array<{ id: string; name: string; type: string }>;
      fromCategories: Array<{ id: string; name: string }>;
      toCategories: Array<{ id: string; name: string }>;
    } | null;
    isLoading: boolean;
    error: string | null;
    lastFetchedType: TransactionType | null;
    hasFetched: boolean;
  };
  createTransaction: {
    data: Transaction | null;
    isLoading: boolean;
    error: string | null;
    isSuccess: boolean;
  };
}

// Initial state
const initialState: CreateTransactionState = {
  partners: {
    data: [],
    isLoading: false,
    error: null,
    hasFetched: false,
  },
  products: {
    data: [],
    isLoading: false,
    error: null,
    hasFetched: false,
  },
  currencies: {
    data: [],
    isLoading: false,
    error: null,
    hasFetched: false,
  },
  supportingData: {
    data: null,
    isLoading: false,
    error: null,
    lastFetchedType: null,
    hasFetched: false,
  },
  createTransaction: {
    data: null,
    isLoading: false,
    error: null,
    isSuccess: false,
  },
};

// Create the slice
const createTransactionSlice = createSlice({
  name: 'createTransaction',
  initialState,
  reducers: {
    resetCreateTransactionState: () => initialState,
    clearPartnersError: (state) => {
      state.partners.error = null;
    },
    clearProductsError: (state) => {
      state.products.error = null;
    },
    clearCurrenciesError: (state) => {
      state.currencies.error = null;
    },
    clearSupportingDataError: (state) => {
      state.supportingData.error = null;
    },
    clearCreateTransactionError: (state) => {
      state.createTransaction.error = null;
    },
    resetCreateTransactionStatus: (state) => {
      state.createTransaction.isSuccess = false;
      state.createTransaction.error = null;
      state.createTransaction.data = null;
    },
    retryFetchPartners: (state) => {
      state.partners.hasFetched = false;
      state.partners.error = null;
    },
    retryFetchProducts: (state) => {
      state.products.hasFetched = false;
      state.products.error = null;
    },
    retryFetchCurrencies: (state) => {
      state.currencies.hasFetched = false;
      state.currencies.error = null;
    },
    retryFetchSupportingData: (state) => {
      state.supportingData.hasFetched = false;
      state.supportingData.error = null;
      state.supportingData.lastFetchedType = null;
    },
  },
  extraReducers: (builder) => {
    // Partners
    builder.addCase(fetchPartners.pending, (state) => {
      state.partners.isLoading = true;
      state.partners.error = null;
    });
    builder.addCase(fetchPartners.fulfilled, (state, action: PayloadAction<Partner[]>) => {
      state.partners.isLoading = false;
      state.partners.data = action.payload;
      state.partners.error = null;
      state.partners.hasFetched = true;

      if (action.payload.length === 0) {
        // No partners found
      }
    });
    builder.addCase(fetchPartners.rejected, (state, action) => {
      state.partners.isLoading = false;
      state.partners.error = action.payload || 'Failed to fetch partners';
      state.partners.hasFetched = true;
    });

    // Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.products.isLoading = true;
      state.products.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      state.products.isLoading = false;
      state.products.data = action.payload;
      state.products.error = null;
      state.products.hasFetched = true;

      if (action.payload.length === 0) {
        // No products found
      }
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.products.isLoading = false;
      state.products.error = action.payload || 'Failed to fetch products';
      state.products.hasFetched = true;
    });

    // Currencies
    builder.addCase(fetchCurrencies.pending, (state) => {
      state.currencies.isLoading = true;
      state.currencies.error = null;
    });
    builder.addCase(fetchCurrencies.fulfilled, (state, action: PayloadAction<Currency[]>) => {
      state.currencies.isLoading = false;
      state.currencies.data = action.payload;
      state.currencies.error = null;
      state.currencies.hasFetched = true;

      if (action.payload.length === 0) {
        toast.info('No currencies found');
      }
    });
    builder.addCase(fetchCurrencies.rejected, (state, action) => {
      state.currencies.isLoading = false;
      state.currencies.error = action.payload || 'Failed to fetch currencies';
      state.currencies.hasFetched = true;
    });

    // Supporting Data
    builder.addCase(fetchSupportingData.pending, (state) => {
      state.supportingData.isLoading = true;
      state.supportingData.error = null;
    });
    builder.addCase(fetchSupportingData.fulfilled, (state, action) => {
      state.supportingData.isLoading = false;
      state.supportingData.data = action.payload;
      state.supportingData.error = null;
      state.supportingData.hasFetched = true;
      state.supportingData.lastFetchedType = action.meta.arg;
    });
    builder.addCase(fetchSupportingData.rejected, (state, action) => {
      state.supportingData.isLoading = false;
      state.supportingData.error = action.payload || 'Failed to fetch supporting data';
      state.supportingData.hasFetched = true;
    });

    // Create Transaction
    builder.addCase(createTransaction.pending, (state) => {
      state.createTransaction.isLoading = true;
      state.createTransaction.error = null;
      state.createTransaction.isSuccess = false;
    });
    builder.addCase(createTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
      state.createTransaction.isLoading = false;
      state.createTransaction.data = action.payload;
      state.createTransaction.error = null;
      state.createTransaction.isSuccess = true;
    });
    builder.addCase(createTransaction.rejected, (state, action) => {
      state.createTransaction.isLoading = false;
      state.createTransaction.error = action.payload || 'Failed to create transaction';
      state.createTransaction.isSuccess = false;
    });
  },
});

export const {
  resetCreateTransactionState,
  clearPartnersError,
  clearProductsError,
  clearCurrenciesError,
  clearSupportingDataError,
  clearCreateTransactionError,
  resetCreateTransactionStatus,
  retryFetchPartners,
  retryFetchProducts,
  retryFetchCurrencies,
  retryFetchSupportingData,
} = createTransactionSlice.actions;

export default createTransactionSlice.reducer;
