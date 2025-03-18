import { httpClient } from '@/config/HttpClient';
import { Account } from '@/features/home/module/account/slices/types';
import { Response } from '@/shared/types/Common.types';

const accountServices = {
  fetchAccounts: async (): Promise<Response<Account[]>> => {
    return httpClient.get<Response<Account[]>>('/api/accounts/lists');
  },
};

export default accountServices;
