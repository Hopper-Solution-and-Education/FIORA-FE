// src/features/setting/module/partner/domain/entities/Partner.ts

import { PaginationResponse } from '@/shared/types';
import { Transaction, User } from '@prisma/client';

export class Partner {
  id: string;
  userId: string;
  logo: string | null;
  name: string;
  identify: string | null;
  dob: string | null;
  taxNo: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
  parentId: string | null;
  parent: Partner | null;
  children: Partner[];
  user: User;
  transactions: Transaction[];
  bankAccount: string | null;
  expense: number;
  income: number;
  icon: string;

  constructor(
    id: string,
    userId: string,
    name: string,
    createdAt: string,
    updatedAt: string,
    createdBy: string,
    user: User,
    transactions: Transaction[] = [],
    children: Partner[] = [],
    logo: string | null = null,
    identify: string | null = null,
    dob: string | null = null,
    taxNo: string | null = null,
    address: string | null = null,
    email: string | null = null,
    phone: string | null = null,
    description: string | null = null,
    updatedBy: string | null = null,
    parentId: string | null = null,
    parent: Partner | null = null,
    bankAccount: string | null = null,
    expense: number = 0,
    income: number = 0,
    icon: string = '',
  ) {
    this.id = id;
    this.userId = userId;
    this.logo = logo;
    this.name = name;
    this.identify = identify;
    this.dob = dob;
    this.taxNo = taxNo;
    this.address = address;
    this.email = email;
    this.phone = phone;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
    this.updatedBy = updatedBy;
    this.parentId = parentId;
    this.parent = parent;
    this.children = children;
    this.user = user;
    this.transactions = transactions;
    this.expense = expense;
    this.income = income;
    this.icon = icon;
    this.bankAccount = bankAccount;
  }
}

export class CreatePartnerResponse {}

// Response cho lấy danh sách Partner (phân trang)
export type GetPartnerResponse = PaginationResponse<Partner>;

export type GetSinglePartnerResponse = Partner;

export type UpdatePartnerResponse = Partner;

export type DeletePartnerRequest = {
  id: string;
};
export type DeletePartnerResponse = {
  id: string;
};

// Request và Response cho lấy giao dịch của Partner
export type GetPartnerTransactionRequest = {
  userId: string;
  page: number;
  pageSize: number;
};

export type GetPartnerTransactionResponse = PaginationResponse<PartnerTransactionResponse>;

export type PartnerTransactionResponse = {
  transaction: {
    id: string;
    type: string; // Có thể thay bằng enum cụ thể nếu có (ví dụ: CategoryType)
  };
  partner: {
    id: string;
    name: string;
    logo: string | null;
    description: string | null;
    identify: string | null;
    taxNo: string | null;
    address: string | null;
    email: string | null;
    phone: string | null;
    bankAccount: string | null;
  };
};
