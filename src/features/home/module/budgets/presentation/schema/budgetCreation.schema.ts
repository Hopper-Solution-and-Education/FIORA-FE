import { Currency } from '@prisma/client';
import * as yup from 'yup';

const budgetCreationSchema = yup.object({
  id: yup.string().optional(),
  icon: yup.string().required('Icon is required'),
  // Corrected field and validation for fiscal year
  fiscalYear: yup
    .string()
    .max(4, 'Fiscal year must be 4 digits')
    .required('Fiscal year is required'),
  currency: yup.string().required('Currency is required'),
  totalExpense: yup
    .number()
    .required('Total expense is required')
    .min(1, 'Total income must be greater than 0'),
  totalIncome: yup
    .number()
    .required('Total income is required')
    .min(1, 'Total income must be greater than 0'),
  // Added missing description field
  description: yup.string().optional().max(1000, 'Description must be less than 1000 characters'),
});

// Example of a default value object for Budget:
export const defaultBudgetFormValue = {
  icon: 'banknote',
  fiscalYear: new Date().getFullYear().toString(),
  type: '',
  currency: Currency.VND,
  totalExpense: 0,
  totalIncome: 0,
  description: '',
};

// Define the form values type
type BudgetCreationFormValues = yup.InferType<typeof budgetCreationSchema>;

export { budgetCreationSchema };
export type { BudgetCreationFormValues };
