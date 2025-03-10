import { Icon } from '@/components/Icon';
export interface Response<T> {
  message: string;
  data: T;
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
