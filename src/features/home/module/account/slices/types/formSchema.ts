import { iconOptions } from '@/shared/constants/data';
import * as yup from 'yup';
import { ACCOUNT_RULES } from '@/shared/constants/account';

// Helper function to calculate available limit
const calculateAvailableLimit = (limit: number, balance: number): number => {
  return (limit || 0) + (balance || 0);
};

// Yup validation schema
const validateNewAccountSchema = yup.object({
  icon: yup.string().required('Please select an icon'),
  type: yup.string().required('Please select a type'),
  name: yup
    .string()
    .required('Account name is required')
    .min(2, 'Name must be at least 2 characters'),
  currency: yup.string().required('Please select a currency'),
  limit: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, 'Limit must be greater than or equal to 0')
    .typeError('Please enter a valid number for the limit')
    .notRequired(),
  balance: yup
    .number()
    .test('balance-validation', 'Invalid balance for account type', function (value) {
      const { type } = this.parent;
      if (!type) return true; // Skip validation if type is not selected yet

      const accountRule = ACCOUNT_RULES[type];
      if (!accountRule) return true; // Skip validation if rule not found

      if (value === undefined) return true; // Skip validation if value is undefined

      if (accountRule.minBalance !== null && value < accountRule.minBalance) {
        return false;
      }

      if (accountRule.maxBalance !== null && value > accountRule.maxBalance) {
        return false;
      }

      return true;
    })
    .required('Balance is required'),
  parentId: yup.string().nullable(),
  isTypeDisabled: yup.boolean().required(),
  availableLimit: yup
    .number()
    .test('available-limit-validation', 'Available limit cannot be negative', function (value) {
      const { type, limit, balance } = this.parent;
      if (type !== 'CreditCard') return true; // Only validate for credit cards
      if (value === undefined) return true; // Skip if not provided

      const calculatedLimit = calculateAvailableLimit(limit, balance);
      return calculatedLimit >= 0;
    })
    .notRequired(),
});

const validateUpdateAccountSchema = yup.object({
  icon: yup.string().required('Please select an icon'),
  name: yup
    .string()
    .required('Account name is required')
    .min(2, 'Name must be at least 2 characters'),
  parentId: yup.string().nullable(),
  type: yup.string().required('Please select a type'),
  currency: yup.string().required('Please select a currency'),
  limit: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .min(0, 'Limit must be greater than or equal to 0')
    .typeError('Please enter a valid number for the limit')
    .notRequired(),
  balance: yup
    .number()
    .test('balance-validation', 'Invalid balance for account type', function (value) {
      const { type } = this.parent;
      if (!type) return true; // Skip validation if type is not selected yet

      const accountRule = ACCOUNT_RULES[type];
      if (!accountRule) return true; // Skip validation if rule not found

      if (value === undefined) return true; // Skip validation if value is undefined

      if (accountRule.minBalance !== null && value < accountRule.minBalance) {
        return false;
      }

      if (accountRule.maxBalance !== null && value > accountRule.maxBalance) {
        return false;
      }

      return true;
    })
    .required('Balance is required'),
  isTypeDisabled: yup.boolean().required(),
  availableLimit: yup
    .number()
    .test('available-limit-validation', 'Available limit cannot be negative', function (value) {
      const { type, limit, balance } = this.parent;
      if (type !== 'CreditCard') return true; // Only validate for credit cards
      if (value === undefined) return true; // Skip if not provided

      const calculatedLimit = calculateAvailableLimit(limit, balance);
      return calculatedLimit >= 0;
    })
    .notRequired(),
});

const defaultNewAccountValues: NewAccountDefaultValues = {
  icon: iconOptions[0].options[0].value,
  type: '',
  name: '',
  currency: 'VND',
  limit: 0,
  balance: 0,
  parentId: null,
  isTypeDisabled: false,
  availableLimit: 0,
};

export { validateNewAccountSchema, validateUpdateAccountSchema, defaultNewAccountValues };
export type NewAccountDefaultValues = yup.InferType<typeof validateNewAccountSchema>;
export type UpdateAccountDefaultValues = yup.InferType<typeof validateUpdateAccountSchema>;
