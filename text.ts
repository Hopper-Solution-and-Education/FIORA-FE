// services/api.ts
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Mutex } from 'async-mutex';
import QueryString from 'qs';

import { BASE_API } from '@/utils/config/env';
import { getRefreshToken } from '@/utils/functions';

import {
  getErrorWithMessage,
  isApiError,
  isApiResponse,
  isFetchBaseQueryError,
  isValueInObject,
} from '../helpers';
import { EPermissionPlatform } from '../models/auth/IGetUserPermissionRequest';

export const API_KEYS = {
  BASE_API: '/api/',
};

export const API_PROXY = {
  BASE_API: BASE_API + API_KEYS.BASE_API,
};

const mutex = new Mutex();

// Define a service using a base URL and expected endpoints
const baseQuery = fetchBaseQuery({
  baseUrl: '/',
  paramsSerializer(params) {
    return QueryString.stringify(params, { arrayFormat: 'brackets' });
  },

  prepareHeaders: (headers) => {
    const localToken = (localStorage.getItem('token') || '').toString();
    if (localToken) {
      const parseToken = JSON.parse(localToken);
      headers.set('authorization', `Bearer ${parseToken}`);
    }
    return headers;
  },
});

interface FetchArgsErr extends FetchArgs {
  showError?: boolean;
}
const customBaseQuery: BaseQueryFn<string | FetchArgsErr, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  let data = result?.data;
  let error = result?.error;

  const showError = typeof args === 'object' ? args?.showError : undefined;

  if (error?.status === 401) {
    const refreshAccessToken = getRefreshToken();
    if (refreshAccessToken) {
      // handle refresh token
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          const refreshResult: any = await baseQuery(
            {
              url: API_PROXY.AUTH_API + 'refresh-access-token',
              method: 'POST',
              headers: {
                'X-PLATFORM': 'WEB',
              },
              body: {
                refreshToken: refreshAccessToken,
                platform: localStorage.getItem('current_sign_in_role') || EPermissionPlatform.WEB,
              },
            },
            api,
            extraOptions,
          );
          if (refreshResult?.data?.statusCode === 200) {
            api.dispatch({
              type: 'auth/setAuth',
              payload: { ...refreshResult?.data },
            });
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch({ type: 'auth/logout' });
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        result = await baseQuery(args, api, extraOptions);
      }
    } else {
      api.dispatch({ type: 'auth/logout' });
    }
  }

  data = result?.data;
  error = result?.error;
  // Handle show notify error mutation
  if (showError !== false) {
    if (api.type === 'mutation' || showError) {
      if (isFetchBaseQueryError(error)) {
        const { message } = getErrorWithMessage(result);
        notify.show({
          message: message,
          type: 'error',
        });
      }
    }
  }
  // handle api response error
  if (isApiError(data)) {
    const { statusCode, data: errorData } = data;
    if ((error && error['status'] === 401) || statusCode === 401) {
      // handle un authentication
    }
    const errMsg = errorData.length ? errorData[0]?.defaultMessage : '';
    if (errMsg) {
      const parseResult: { error: FetchBaseQueryError } = {
        error: {
          status: 500,
          data: { message: errMsg },
        },
      };

      return parseResult;
    }
  }

  // handle HTTP error
  if (isFetchBaseQueryError(error)) {
    const errObj = 'error' in error ? error.error : error.data;
    const errMsg =
      isValueInObject(errObj, 'message') && typeof errObj.message === 'string'
        ? errObj.message
        : JSON.stringify(errObj);
    return { error: { status: 500, data: { message: errMsg } } };
  }
  // API Success
  if (isApiResponse(data)) {
    const { statusCode } = data;
    if (statusCode >= 200 && statusCode < 300) return { data };
  }

  return result;
};

export const api = createApi({
  /**
   * `reducerPath` is optional and will not be required by most users.
   * This is useful if you have multiple API definitions,
   * e.g. where each has a different domain, with no interaction between endpoints.
   * Otherwise, a single API definition should be used in order to support tag invalidation,
   * among other features
   */
  reducerPath: 'splitApi',
  /**
   * A bare bones base query would just be `baseQuery: fetchBaseQuery({ baseUrl: '/' })`
   */
  baseQuery: customBaseQuery,
  /**
   * Tag types must be defined in the original API definition
   * for any tags that would be provided by injected endpoints
   */
  tagTypes: [
    'Auth',
    'Project',
    'Expense',
    'Global',
    'Currency',
    'Attachment',
    'Location',
    'Department',
    '2FA',
    'CandidateDocuments',
  ],
  /**
   * This api has endpoints injected in adjacent files,
   * which is why no endpoints are shown below.
   * If you want all endpoints defined in the same file, they could be included here instead
   */
  endpoints: () => ({}),
});
