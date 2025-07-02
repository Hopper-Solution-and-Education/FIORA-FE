import { httpClient } from '@/config/http-client/HttpClient';
import { ITransactionPaginatedResponse } from '@/features/home/module/transaction/types';
import { Transaction } from '@/features/setting/module/product/domain/entities/Transaction';
import { FilterCriteria } from '@/shared/types';
import { Response } from '@/shared/types/Common.types';

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
};

export default expenseIncomeServices;
