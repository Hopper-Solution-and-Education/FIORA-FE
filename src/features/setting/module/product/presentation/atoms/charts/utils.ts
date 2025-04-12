import { ProductFormValues } from '../../schema/addProduct.schema';

export type BarItem = {
  id?: string;
  name: string;
  description: string;
  taxRate: number;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  value: number;
  color?: string;
  type: string;
  parent?: string;
  children?: BarItem[];
  isChild?: boolean;
  depth?: number;
  product?: ProductFormValues;
  expense?: number;
  income?: number;
};

export type LevelConfig = {
  totalName?: string;
  colors: {
    [depth: number]: string;
  };
};
