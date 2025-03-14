import { iconOptions } from '@/shared/constants/data';
import { CategoryType } from '@prisma/client';
import * as yup from 'yup';

// * CATEGORY SCHEMA
// * 1. Create Category Schema
const validateNewCategorySchema = yup.object({
  name: yup
    .string()
    .required('Category name is required')
    .min(2, 'Name must be at least 2 characters'),
  type: yup
    .mixed<CategoryType>()
    .oneOf([CategoryType.Expense, CategoryType.Income], 'Invalid category type')
    .required('Category type is required'),
  icon: yup.string().required('Please select an icon'),
  description: yup.string().max(500, 'Description cannot exceed 500 characters').nullable(),
  parentId: yup.string().nullable(),
  isTypeDisabled: yup.boolean().required(),
});

const defaultNewCategoryValues: NewCategoryDefaultValues = {
  name: '',
  type: CategoryType.Expense,
  icon: iconOptions[0].options[0].value,
  description: '',
  parentId: null,
  isTypeDisabled: false,
};

// * 2. Update Category Schema

// * 3. Delete Category Schema

export { validateNewCategorySchema, defaultNewCategoryValues };
export type NewCategoryDefaultValues = yup.InferType<typeof validateNewCategorySchema>;
