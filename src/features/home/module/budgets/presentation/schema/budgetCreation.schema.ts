import * as yup from 'yup';

const budgetCreationSchema = yup.object({
  id: yup.string().optional(),
  icon: yup.string().required('Icon is required'),
  // Corrected field and validation for fiscal year
  fiscalYear: yup
    .string()
    .required('Fiscal year is required')
    .max(10, 'Fiscal year format is too long'),
  currency: yup.string().required('Currency is required'),
  totalExpense: yup
    .number()
    .required('Total expense is required')
    .min(0, 'Total expense must be non-negative'),
  totalIncome: yup
    .number()
    .required('Total income is required')
    .min(0, 'Total income must be non-negative'),
  // Added missing description field
  description: yup.string().optional().max(1000, 'Description must be less than 1000 characters'),
});

// Example of a default value object for Budget:
export const defaultBudgetFormValue = {
  icon: '',
  fiscalYear: '',
  totalExpense: 0,
  totalIncome: 0,
  description: '',
};

// Define the form values type
type BudgetCreationFormValues = yup.InferType<typeof budgetCreationSchema>;

export { budgetCreationSchema };
export type { BudgetCreationFormValues };
