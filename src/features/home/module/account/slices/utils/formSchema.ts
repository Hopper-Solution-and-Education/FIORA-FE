import * as yup from 'yup';

export const validateNewAccountSchema = yup.object({
  name: yup
    .string()
    .required('Account name is required')
    .min(2, 'Name must be at least 2 characters'),
  type: yup
    .string()
    .oneOf(['Payment', 'Saving', 'CreditCard', 'Debt', 'Lending'], 'Invalid account type')
    .required('Account type is required'),
  icon: yup.string().required('Please select an icon'),
  description: yup.string().max(500, 'Description cannot exceed 500 characters').nullable(),
  currency: yup.string().required('Currency is required'),
  limit: yup.string().default('0'),
  balance: yup.string().default('0'),
  parentId: yup.string().nullable(),
});

export const validateUpdateAccountSchema = yup.object({
  id: yup.string().required('Account ID is required'),
  name: yup
    .string()
    .required('Account name is required')
    .min(2, 'Name must be at least 2 characters'),
  type: yup
    .string()
    .oneOf(['Payment', 'Saving', 'CreditCard', 'Debt', 'Lending'], 'Invalid account type')
    .required('Account type is required'),
  icon: yup.string().required('Please select an icon'),
  description: yup.string().max(500, 'Description cannot exceed 500 characters').nullable(),
  currency: yup.string().required('Currency is required'),
  limit: yup.string().default('0'),
  balance: yup.string().default('0'),
  parentId: yup.string().nullable(),
});

export const defaultNewAccountValues: NewAccountDefaultValues = {
  name: '',
  type: 'Payment',
  icon: 'circle', // Default icon, adjust based on your icon options
  description: '',
  currency: 'VND',
  limit: '0',
  balance: '0',
  parentId: null,
};

export const defaultUpdateAccountValues: UpdateAccountDefaultValues = {
  id: '',
  name: '',
  type: 'Payment',
  icon: 'circle',
  description: '',
  currency: 'VND',
  limit: '0',
  balance: '0',
  parentId: null,
};

export type NewAccountDefaultValues = yup.InferType<typeof validateNewAccountSchema>;
export type UpdateAccountDefaultValues = yup.InferType<typeof validateUpdateAccountSchema>;
