import { TransactionType } from '@prisma/client';
import * as yup from 'yup';
import { InferType } from 'yup';

const validateNewTransactionSchema = yup.object({
  type: yup
    .mixed<TransactionType>()
    .oneOf(Object.values(TransactionType), 'Please select a valid transaction type')
    .required(),
  date: yup.date().required('Date is required').typeError('Please provide a valid date'),
  amount: yup
    .number()
    .required('Amount is required')
    .typeError('Amount must be a number')
    .positive('Amount must be greater than 0'),
  currency: yup
    .string()
    .required('Currency is required')
    .typeError('Currency must be a string')
    .min(1, 'Please select a currency')
    .test('not-none', 'Please select a valid currency', (value) => value !== 'none'),
  product: yup
    .string()
    .nullable()
    .transform((val) => val || null),
  fromId: yup
    .string()
    .required('From account/category is required')
    .min(1, 'Please select a from account or category'),
  toId: yup
    .string()
    .required('To account/category is required')
    .min(1, 'Please select a to account or category'),
  partnerId: yup
    .string()
    .nullable()
    .transform((val) => val || null),
  remark: yup.string().required('Description is required'),
});

const defaultNewTransactionValues: NewTransactionDefaultValues = {
  type: TransactionType.Expense,
  date: new Date(),
  amount: 0,
  currency: '',
  product: null,
  fromId: '', // From account or category ID
  toId: '', // To account or category ID
  partnerId: null,
  remark: '',
};

export { defaultNewTransactionValues, validateNewTransactionSchema };

export type NewTransactionDefaultValues = InferType<typeof validateNewTransactionSchema>;
