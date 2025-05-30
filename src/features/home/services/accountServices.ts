import { httpClient } from '@/config/http-client/HttpClient';
import { Account, AccountFilterResponse } from '@/features/home/module/account/slices/types';
import {
  NewAccountDefaultValues,
  UpdateAccountDefaultValues,
} from '@/features/home/module/account/slices/types/formSchema';
import { FilterCriteria } from '@/shared/types';
import { Response } from '@/shared/types/Common.types';

const accountServices = {
  fetchAccounts: async (data: FilterCriteria): Promise<Response<AccountFilterResponse>> => {
    return httpClient.post<Response<AccountFilterResponse>>('/api/accounts/search', data);
  },
  createAccount: async (data: NewAccountDefaultValues): Promise<Response<Account>> => {
    return httpClient.post<Response<Account>>('/api/accounts/create', data);
  },
  fetchParents: async (data: FilterCriteria): Promise<Response<AccountFilterResponse>> => {
    return httpClient.post<Response<AccountFilterResponse>>(
      '/api/accounts/search?isParent=true',
      data,
    );
  },
  updateAccount(id: string, data: Partial<UpdateAccountDefaultValues>): Promise<Response<Account>> {
    return httpClient.put<Response<Account>>(`/api/accounts/${id}`, data);
  },
  deleteAccount(id: string): Promise<Response<Account>> {
    return httpClient.delete<Response<Account>>(`/api/accounts/${id}`);
  },
};

export default accountServices;
