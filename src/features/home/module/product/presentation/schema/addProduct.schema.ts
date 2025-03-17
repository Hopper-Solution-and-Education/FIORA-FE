import { ProductType } from '@prisma/client';
import * as yup from 'yup';

// Define the form schema
const productSchema = yup.object({
  icon: yup.string().required('Icon is required'),
  name: yup.string().required('Name is required').max(50, 'Name must be less than 50 characters'),
  description: yup.string().max(1000, 'Description must be less than 1000 characters'),
  price: yup.number().required('Price is required').positive('Price must be positive'),
  taxRate: yup.number().nullable().positive('Tax rate must be positive'),
  type: yup
    .mixed<ProductType>()
    .oneOf(Object.values(ProductType))
    .required('Product type is required'),
  category_id: yup.string().required('Category is required'),
  items: yup.array().default([]),
});

// Define the form values type
type ProductFormValues = yup.InferType<typeof productSchema>;

export { productSchema };
export type { ProductFormValues };
