import { httpClient } from '@/config/HttpClient';
import { Account } from '@/features/home/module/account/slices/types';
import { Response } from '@/shared/types/Common.types';

const accountServices = {
  fetchAccounts: async (): Promise<Response<Account[]>> => {
    return httpClient.get<Response<Account[]>>('/api/accounts/lists');
  },
  createAccount: async (data: Account): Promise<Response<Account>> => {
    return httpClient.post<Response<Account>>('/api/accounts/create', data);
  },
  fetchParents: async (): Promise<Response<Account[]>> => {
    return httpClient.get<Response<Account[]>>('/api/accounts/lists?isParent=true');
  },
};

export default accountServices;
