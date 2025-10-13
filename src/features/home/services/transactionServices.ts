import { httpClient } from '@/config/http-client/HttpClient';
import {
  CreateTransactionBody,
  ITransactionPaginatedResponse,
} from '@/features/home/module/transaction/types';
import { Transaction } from '@/features/setting/module/product/domain/entities/Transaction';
import { FilterCriteria, Response } from '@/shared/types';
import { Partner, Product, TransactionType } from '@prisma/client';

// Currency type based on API response
interface Currency {
  id: string;
  name: string;
  symbol: string;
}

const expenseIncomeServices = {
  getFilteredTransactions: async (
    filter: FilterCriteria,
  ): Promise<Response<ITransactionPaginatedResponse>> => {
    return httpClient.post<Response<ITransactionPaginatedResponse>>('/api/transactions', filter);
  },
  deleteTransaction: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`/api/transactions/transaction?id=${id}`);
  },
  getTransactionById: async (id: string): Promise<Response<Transaction>> => {
    return httpClient.get<Response<Transaction>>(`/api/transactions/${id}`);
  },
  updateTransaction: async (
    id: string,
    data: Partial<Transaction>,
  ): Promise<Response<Transaction>> => {
    return httpClient.put<Response<Transaction>>(`/api/transactions/${id}`, data);
  },
  getPartners: async (): Promise<Response<Partner[]>> => {
    return httpClient.get<Response<Partner[]>>('/api/partners');
  },
  getProducts: async (): Promise<Response<{ data: Product[] }>> => {
    return httpClient.get<Response<{ data: Product[] }>>('/api/products');
  },
  getSupportingData: async (
    type: TransactionType,
  ): Promise<
    Response<{
      fromAccounts: Array<{ id: string; name: string; type: string }>;
      toAccounts: Array<{ id: string; name: string; type: string }>;
      fromCategories: Array<{ id: string; name: string }>;
      toCategories: Array<{ id: string; name: string }>;
    }>
  > => {
    return httpClient.get<
      Response<{
        fromAccounts: Array<{ id: string; name: string; type: string }>;
        toAccounts: Array<{ id: string; name: string; type: string }>;
        fromCategories: Array<{ id: string; name: string }>;
        toCategories: Array<{ id: string; name: string }>;
      }>
    >(`/api/transactions/supporting-data?type=${type}`);
  },
  getCurrencies: async (): Promise<Response<Currency[]>> => {
    return httpClient.get<Response<Currency[]>>('/api/setting/exchange-currency');
  },
  createTransaction: async (data: CreateTransactionBody): Promise<Response<Transaction>> => {
    return httpClient.post<Response<Transaction>>('/api/transactions/transaction', data);
  },
};

export default expenseIncomeServices;
