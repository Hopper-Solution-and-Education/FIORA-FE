import { KYCMethod, KYCStatus, KYCType } from '@prisma/client';

export interface UserFilterParams {
  search?: string;
  role?: string | string[];
  status?: string | string[];
  fromDate?: string; // eKYC created date from
  toDate?: string; // eKYC created date to
  userFromDate?: string; // User created date from
  userToDate?: string; // User created date to
  email?: string[];
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
  avatarUrl: string | null;
  eKYC: {
    id: string;
    status: KYCStatus;
    method: KYCMethod;
    type: KYCType | null;
    fieldName: string;
    createdAt: Date;
  }[];
}

export interface UserSearchResultCS {
  id: string;
  name: string | null;
  email: string;
  kyc_levels: string[];
  createdAt: Date;
  updatedAt: Date;
  avatarId: string | null;
  avatarUrl: string | null;
  eKYC: {
    id: string;
    status: KYCStatus;
    method: KYCMethod;
    type: KYCType | null;
    fieldName: string;
    createdAt: Date;
  }[];
}
