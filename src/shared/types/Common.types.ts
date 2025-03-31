import { ComponentType } from 'react';
import { AnySchema } from 'yup';
import { Icon } from '@/components/Icon';
import { Prisma } from '@prisma/client';
export interface Response<T> {
  message: string;
  data: T;
  status: number;
}

export interface IconsOptions {
  label: string;
  options: Option[];
}

export interface Option {
  value: string;
  label: string;
  icon: Icon;
}

export interface PaginationResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalPage: number;
  total?: number;
}

export interface Pagination {
  page?: number;
  pageSize?: number;
}

export type FieldConfig = {
  name: string;
  type: string;
  component?: ComponentType<any>;
  validation?: AnySchema;
  props?: Record<string, any>;
};

export type fromAccountKey = Prisma.AccountScalarFieldEnum;
export type toAccountKey = Prisma.AccountScalarFieldEnum;

export type OrderByFields = {
  date?: Prisma.SortOrder;
  type?: Prisma.SortOrder;
  fromAccount?: Prisma.SortOrder;
  toAccount?: Prisma.SortOrder;
  partner?: Prisma.SortOrder;
  amount?: Prisma.SortOrder;
};

export type RequestType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
