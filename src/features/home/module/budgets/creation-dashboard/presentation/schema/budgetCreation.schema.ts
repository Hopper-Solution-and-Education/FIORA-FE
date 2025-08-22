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
  estimatedTotalExpense: yup.number(),
  // .test(
  //   'min-or-zero-expense',
  //   'Total expense must be 0 or at least 2,500,000 VND or 100 USD',
  //   function (value) {
  //     const { currency } = this.parent;
  //     if (typeof value !== 'number') return false;
  //     if (value === 0) return true;
  //     if (currency === Currency.VND) return value >= 2500000;
  //     if (currency === Currency.USD) return value >= 100;
  //     return true; // For other currencies, skip this rule
  //   },
  // ),
  estimatedTotalIncome: yup.number(),
  // .test(
  //   'min-or-zero-income',
  //   'Total income must be 0 or at least 2,500,000 VND or 100 USD',
  //   function (value) {
  //     const { currency } = this.parent;
  //     if (typeof value !== 'number') return false;
  //     if (value === 0) return true;
  //     if (currency === Currency.VND) return value >= 2500000;
  //     if (currency === Currency.USD) return value >= 100;
  //     return true;
  //   },
  // ),
  // Added missing description field
  description: yup.string().optional().max(1000, 'Description must be less than 1000 characters'),
});

// Example of a default value object for Budget:
export const defaultBudgetFormValue = {
  icon: 'banknote',
  fiscalYear: new Date().getFullYear().toString(),
  currency: 'VND',
  estimatedTotalExpense: 0,
  estimatedTotalIncome: 0,
  description: '',
};

// Define the form values type
type BudgetCreationFormValues = yup.InferType<typeof budgetCreationSchema>;

export { budgetCreationSchema };
export type { BudgetCreationFormValues };

