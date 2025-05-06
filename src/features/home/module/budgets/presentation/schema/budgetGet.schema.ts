import * as yup from 'yup';

const budgetGetSchema = yup.object({
  search: yup.string().optional(),
  fromYear: yup.string().max(4, 'Fiscal year must be 4 digits').nullable(),
  toYear: yup.string().max(4, 'Fiscal year must be 4 digits').nullable(),
});

// Example of a default value object for Budget:
export const defaultBudgeGetFormValue = {
  search: '',
  fromYear: (new Date().getFullYear() - 10).toString(),
  toYear: new Date().getFullYear().toString(),
};

// Define the form values type
type BudgetGetFormValues = yup.InferType<typeof budgetGetSchema>;

export { budgetGetSchema };
export type { BudgetGetFormValues };
