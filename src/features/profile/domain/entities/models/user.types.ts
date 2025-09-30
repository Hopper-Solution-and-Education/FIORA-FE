import { KYCMethod, KYCStatus, KYCType } from '@prisma/client';

export interface UserFilterParams {
  search?: string;
  role?: string | string[];
  status?: string | string[];
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface UserSearchResult {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isBlocked: boolean | null;
  kyc_levels: string[];
  createdAt: Date;
  updatedAt: Date;
  avatarId: string | null;
  eKYC: {
    id: string;
    status: KYCStatus;
    method: KYCMethod;
    type: KYCType | null;
    fieldName: string;
    createdAt: Date;
  }[];
}
