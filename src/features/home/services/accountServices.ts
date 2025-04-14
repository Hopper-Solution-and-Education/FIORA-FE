import { httpClient } from '@/config/http-client/HttpClient';
import { Account } from '@/features/home/module/account/slices/types';
import {
  NewAccountDefaultValues,
  UpdateAccountDefaultValues,
} from '@/features/home/module/account/slices/types/formSchema';
import { Response } from '@/shared/types/Common.types';

const accountServices = {
  fetchAccounts: async (): Promise<Response<Account[]>> => {
    return httpClient.get<Response<Account[]>>('/api/accounts/lists');
  },
  createAccount: async (data: NewAccountDefaultValues): Promise<Response<Account>> => {
    return httpClient.post<Response<Account>>('/api/accounts/create', data);
  },
  fetchParents: async (): Promise<Response<Account[]>> => {
    return httpClient.get<Response<Account[]>>('/api/accounts/lists?isParent=true');
  },
  updateAccount(id: string, data: Partial<UpdateAccountDefaultValues>): Promise<Response<Account>> {
    return httpClient.put<Response<Account>>(`/api/accounts/${id}`, data);
  },
  deleteAccount(id: string): Promise<Response<Account>> {
    return httpClient.delete<Response<Account>>(`/api/accounts/${id}`);
  },
};

export default accountServices;
