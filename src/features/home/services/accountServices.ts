import apiClient from '@/config/http-client';
import { Account, AccountFilterResponse } from '@/features/home/module/account/slices/types';
import {
  NewAccountDefaultValues,
  UpdateAccountDefaultValues,
} from '@/features/home/module/account/slices/types/formSchema';
import { BaseResponse, FilterCriteria } from '@/shared/types';

// Use apiClient to call BE directly on port 5555
const accountServices = {
  fetchAccounts: async (data: FilterCriteria): Promise<BaseResponse<AccountFilterResponse>> => {
    return apiClient.post<AccountFilterResponse>('/api/accounts/search', data);
  },
  createAccount: async (data: NewAccountDefaultValues): Promise<BaseResponse<Account>> => {
    return apiClient.post<Account>('/api/accounts/create', data);
  },
  fetchParents: async (data: FilterCriteria): Promise<BaseResponse<AccountFilterResponse>> => {
    return apiClient.post<AccountFilterResponse>('/api/accounts/search?isParent=true', data);
  },
  updateAccount(
    id: string,
    data: Partial<UpdateAccountDefaultValues>,
  ): Promise<BaseResponse<Account>> {
    return apiClient.put<Account>(`/api/accounts/${id}`, data);
  },
  deleteAccount(id: string): Promise<BaseResponse<Account>> {
    return apiClient.delete<Account>(`/api/accounts/${id}`);
  },
};

export default accountServices;
