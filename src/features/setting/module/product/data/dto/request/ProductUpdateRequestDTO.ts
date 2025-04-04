import { ProductType } from '@prisma/client';
import { ProductItem } from '../../../presentation/schema/addProduct.schema';

export type ProductUpdateRequestDTO = {
  id: string;
  icon: string;
  name: string;
  description?: string;
  tax_rate?: number | null;
  price: number;
  type: ProductType;
  category_id: string;
  items?: ProductItem[];
};
