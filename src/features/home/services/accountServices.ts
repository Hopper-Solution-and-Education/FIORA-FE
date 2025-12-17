import { Account, AccountFilterResponse } from '@/features/home/module/account/slices/types';
import {
  NewAccountDefaultValues,
  UpdateAccountDefaultValues,
} from '@/features/home/module/account/slices/types/formSchema';
import { FilterCriteria, Response } from '@/shared/types';

const BASE_URL = ''; // Use relative URLs to call Next.js API routes

/**
 * Custom fetch wrapper with credentials included for session cookies
 */
async function fetchWithAuth<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: 'include', // Include session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw errorData;
  }

  return response.json();
}

const accountServices = {
  fetchAccounts: async (data: FilterCriteria): Promise<Response<AccountFilterResponse>> => {
    // Remove userId from request body since API route gets it from session
    const { userId, ...requestData } = data;
    return fetchWithAuth<Response<AccountFilterResponse>>('/api/accounts/search', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
  createAccount: async (data: NewAccountDefaultValues): Promise<Response<Account>> => {
    return fetchWithAuth<Response<Account>>('/api/accounts/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  fetchParents: async (data: FilterCriteria): Promise<Response<AccountFilterResponse>> => {
    // Remove userId from request body since API route gets it from session
    const { userId, ...requestData } = data;
    return fetchWithAuth<Response<AccountFilterResponse>>('/api/accounts/search?isParent=true', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
  updateAccount(id: string, data: Partial<UpdateAccountDefaultValues>): Promise<Response<Account>> {
    return fetchWithAuth<Response<Account>>(`/api/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  deleteAccount(id: string): Promise<Response<Account>> {
    return fetchWithAuth<Response<Account>>(`/api/accounts/${id}`, {
      method: 'DELETE',
    });
  },
};

export default accountServices;
