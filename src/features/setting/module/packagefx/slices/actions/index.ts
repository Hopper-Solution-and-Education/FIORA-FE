import { httpClient } from '@/config/http-client/HttpClient';
import { Response } from '@/shared/types/Common.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  CreatePackageFxPayload,
  PackageFx,
  PackageFXWithAttachments,
  UpdatePackageFxPayload,
} from '../types';

function makeSafeName(file: File, maxBaseLen = 60) {
  const orig = file.name || 'file';
  const dot = orig.lastIndexOf('.');
  const base = (dot > -1 ? orig.slice(0, dot) : orig).replace(/[^\w-]+/g, '_');
  const ext = dot > -1 ? orig.slice(dot + 1) : '';
  const shortBase = base.length > maxBaseLen ? base.slice(0, maxBaseLen) : base;
  return ext ? `${shortBase}.${ext}` : shortBase;
}
export const fetchPackageFx = createAsyncThunk(
  'packageFx/fetchPackageFx',
  async (
    payload: { sortBy?: Record<string, 'asc' | 'desc'>; page?: number; limit?: number } = {},
    { rejectWithValue },
  ) => {
    try {
      let url = '/api/wallet/package';
      const params: string[] = [];
      if (payload?.sortBy) {
        params.push(`sortBy=${encodeURIComponent(JSON.stringify(payload.sortBy))}`);
      }
      if (payload?.page) {
        params.push(`page=${payload.page}`);
      }
      if (payload?.limit) {
        params.push(`limit=${payload.limit}`);
      }
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }
      const response = await httpClient.get<Response<PackageFx[]>>(url);
      return {
        data: response.data,
        message: response.message || '',
      };
    } catch (error: any) {
      let message = 'Failed to fetch packages';
      if (typeof error === 'string') {
        message = error;
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.message) {
        message = error.message;
      }
      return rejectWithValue({ message });
    }
  },
);

export const createPackageFx = createAsyncThunk(
  'packageFx/createPackageFx',
  async (payload: CreatePackageFxPayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('fxAmount', String(payload.fxAmount));
      if (payload.attachments?.length) {
        payload.attachments.forEach((f) => {
          const safeName = makeSafeName(f, 60);
          const safeFile = new File([f], safeName, { type: f.type });
          formData.append('file', safeFile);
        });
      }
      const response = await httpClient.post<Response<PackageFXWithAttachments>>(
        '/api/wallet/package',
        formData,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error?.response?.data?.message || 'Failed to create package',
      });
    }
  },
);

export const updatePackageFx = createAsyncThunk(
  'packageFx/updatePackageFx',
  async (payload: UpdatePackageFxPayload, { rejectWithValue }) => {
    try {
      const { id, fxAmount, attachments, removeAttachmentIds } = payload;

      const formData = new FormData();
      formData.append('id', id);
      formData.append('fxAmount', String(fxAmount));
      if (removeAttachmentIds && removeAttachmentIds.length > 0) {
        formData.append('removeAttachmentIds', JSON.stringify(removeAttachmentIds));
      }
      const makeSafeName = (file: File, maxBaseLen = 60) => {
        const orig = file.name || 'file';
        const dot = orig.lastIndexOf('.');
        const base = (dot > -1 ? orig.slice(0, dot) : orig).replace(/[^\w-]+/g, '_');
        const ext = dot > -1 ? orig.slice(dot + 1) : '';
        const shortBase = base.length > maxBaseLen ? base.slice(0, maxBaseLen) : base;
        return ext ? `${shortBase}.${ext}` : shortBase;
      };

      if (attachments?.length) {
        attachments.forEach((f) => {
          const safeName = makeSafeName(f, 60);
          const safeFile = new File([f], safeName, { type: f.type });
          formData.append('file', safeFile);
        });
      }

      const response = await httpClient.put<Response<PackageFXWithAttachments>>(
        '/api/wallet/package',
        formData,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error?.response?.data?.message || 'Failed to update package',
      });
    }
  },
);

export const deletePackageFx = createAsyncThunk(
  'packageFx/deletePackageFx',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await httpClient.delete<Response<{ id: string }>>(
        `/api/wallet/package/${id}`,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to delete package',
      });
    }
  },
);

// Get package by ID
export const getPackageFxById = createAsyncThunk(
  'packageFx/getPackageFxById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await httpClient.get<Response<PackageFx>>(`/api/wallet/package/${id}`);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        message: error.response?.data?.message || 'Failed to get package',
      });
    }
  },
);
