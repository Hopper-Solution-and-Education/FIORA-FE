import { ProductType } from '@prisma/client';
import * as yup from 'yup';

const itemSchema = yup.object().shape({
  name: yup.string().required('Item name is required').max(50, 'Maximum 50 characters'),
  description: yup.string().max(500, 'Maximum 500 characters'),
});

// Define the form schema
const productSchema = yup.object({
  icon: yup.string().required('Icon is required'),
  name: yup.string().required('Name is required').max(50, 'Name must be less than 50 characters'),
  description: yup.string().max(1000, 'Description must be less than 1000 characters'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  taxRate: yup
    .number()
    .nullable()
    .positive('Tax rate must be positive')
    .max(100, 'Tax rate must be less than 100'),
  type: yup
    .mixed<ProductType>()
    .oneOf(Object.values(ProductType))
    .required('Product type is required'),
  category_id: yup.string().required('Category is required'),
  items: yup.array().of(itemSchema),
});

// Define the form values type
type ProductFormValues = yup.InferType<typeof productSchema>;
type ProductItem = yup.InferType<typeof itemSchema>;

export { productSchema };
export type { ProductFormValues, ProductItem };
