import apiClient from '@/config/http-client';
import { Account, AccountFilterResponse } from '@/features/home/module/account/slices/types';
import {
  NewAccountDefaultValues,
  UpdateAccountDefaultValues,
} from '@/features/home/module/account/slices/types/formSchema';
import { ApiEndpointEnum } from '@/shared/constants/ApiEndpointEnum';
import { BaseResponse, FilterCriteria } from '@/shared/types';
import { routeConfig } from '@/shared/utils/route';

// Use apiClient to call BE directly on port 5555
const accountServices = {
  fetchAccounts: async (data: FilterCriteria): Promise<BaseResponse<AccountFilterResponse>> => {
    return apiClient.post<AccountFilterResponse>(routeConfig(ApiEndpointEnum.AccountsSearch), data);
  },
  createAccount: async (data: NewAccountDefaultValues): Promise<BaseResponse<Account>> => {
    return apiClient.post<Account>(routeConfig(ApiEndpointEnum.AccountsCreate), data);
  },
  fetchParents: async (data: FilterCriteria): Promise<BaseResponse<AccountFilterResponse>> => {
    return apiClient.post<AccountFilterResponse>(
      routeConfig(ApiEndpointEnum.AccountsSearch, undefined, { isParent: 'true' }),
      data,
    );
  },
  updateAccount(
    id: string,
    data: Partial<UpdateAccountDefaultValues>,
  ): Promise<BaseResponse<Account>> {
    return apiClient.put<Account>(routeConfig(ApiEndpointEnum.SingleAccount, { id }), data);
  },
  deleteAccount(id: string): Promise<BaseResponse<Account>> {
    return apiClient.delete<Account>(routeConfig(ApiEndpointEnum.SingleAccount, { id }));
  },
  getAccountById(id: string): Promise<BaseResponse<Account>> {
    return apiClient.get<Account>(routeConfig(ApiEndpointEnum.SingleAccount, { id }));
  },
  deleteSubAccount(parentId: string, subAccountId: string): Promise<BaseResponse<void>> {
    return apiClient.post<void>(routeConfig(ApiEndpointEnum.SubAccountDelete), {
      parentId,
      subAccountId,
    });
  },
  fetchBalance(userId: string): Promise<BaseResponse<unknown>> {
    return apiClient.get<unknown>(
      routeConfig(ApiEndpointEnum.AccountBalance, undefined, { userId }),
    );
  },
};

export default accountServices;
