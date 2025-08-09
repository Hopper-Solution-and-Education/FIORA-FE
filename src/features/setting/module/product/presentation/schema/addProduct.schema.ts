import { Currency, ProductType } from '@prisma/client';
import * as yup from 'yup';

const itemSchema = yup.object().shape({
  itemId: yup.string(),
  name: yup
    .string()
    .transform((value) => value?.trim())
    .required('Item name is required')
    .max(50, 'Maximum 50 characters'),
  icon: yup.string().required('Item icon is required'),
  description: yup
    .string()
    .transform((value) => value?.trim())
    .max(500, 'Maximum 500 characters'),
});

// Define the form schema
const productSchema = yup.object({
  id: yup.string(),
  icon: yup.string().required('Icon is required'),
  name: yup
    .string()
    .transform((value) => value?.trim())
    .required('Name is required')
    .max(50, 'Name must be less than 50 characters'),
  description: yup
    .string()
    .transform((value) => value?.trim())
    .max(1000, 'Description must be less than 1000 characters'),
  price: yup.number(),
  taxRate: yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      // If the original value is an empty string, treat it as 0
      if (originalValue === '' || originalValue == null) return 0;
      // If the value is NaN (e.g., from casting '' to number), treat as 0
      if (typeof value === 'number' && isNaN(value)) return 0;
      return value;
    })
    .min(0, 'Tax rate must be greater or equal to 0')
    .max(100, 'Tax rate must be less or equal to 100'),
  type: yup
    .mixed<ProductType>()
    .oneOf(Object.values(ProductType))
    .required('Product type is required'),
  catId: yup.string().required('Category is required'),
  currency: yup.string().required('Currency is required'),
  items: yup.array().of(itemSchema),
  // startDate: yup.date().required('Start date is required'),
  // endDate: yup.date().required('End date is required'),
});

export const defaultProductFormValue: any = {
  icon: '',
  name: '',
  description: '',
  price: 0,
  taxRate: 0,
  type: 'Product',
  catId: '',
  items: [],
  currency: Currency.VND,
  // startDate: new Date(),
  // endDate: new Date(),
};

// Define the form values type
type ProductFormValues = yup.InferType<typeof productSchema>;
type ProductItemSchema = yup.InferType<typeof itemSchema>;

export { productSchema };
export type { ProductFormValues, ProductItemSchema };
