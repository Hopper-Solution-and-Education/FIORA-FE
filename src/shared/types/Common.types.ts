import { ComponentType } from 'react';
import { AnySchema } from 'yup';
import { Icon } from '@/components/Icon';
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
