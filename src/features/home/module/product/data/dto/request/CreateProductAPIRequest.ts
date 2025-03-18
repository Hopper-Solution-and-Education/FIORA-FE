import { ProductItem } from '../../../presentation/schema/addProduct.schema';

export type CreateProductAPIRequest = {
  icon: string;
  name: string;
  description?: string;
  tax_rate?: number | null;
  price: number;
  type: 'Product' | 'Service';
  category_id: string;
  items?: ProductItem[];
};
