import * as yup from 'yup';

export const categoryProductsSchema = yup.object({
  id: yup.string().optional(),
  icon: yup.string().required('Icon is required'),
  name: yup
    .string()
    .trim()
    .max(50, 'Name must be at most 50 characters')
    .required('Name is required'),
  description: yup
    .string()
    .trim()
    .max(1000, 'Description must be at most 1000 characters')
    .nullable(),
  tax_rate: yup
    .number()
    .min(0, 'Tax rate must be greater or equal to 0')
    .max(100, 'Tax rate must be less or equal to 100')
    .required('Tax rate is required'),
  createdAt: yup.date().optional(),
  updatedAt: yup.date().optional(),
});

export type CategoryProductFormValues = yup.InferType<typeof categoryProductsSchema>;

export const defaultCategoryProductValue: CategoryProductFormValues = {
  id: '',
  icon: '',
  name: '',
  description: '',
  tax_rate: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
