import { excludeEmojiPattern } from '@/shared/constants';
import * as yup from 'yup';

const partnerSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Minimum 2 characters')
    .max(50, 'Maximum 50 characters')
    .matches(excludeEmojiPattern, 'Name cannot contain emojis'),
  // Accept mixed types (File or string)
  logo: yup.mixed().nullable().notRequired(),
  identify: yup
    .string()
    .nullable()
    .notRequired()
    .matches(excludeEmojiPattern, 'Identification cannot contain emojis')
    .test('validIdentifyLength', 'Identification should be between 5-20 characters', (value) => {
      if (!value) return true; // Allow empty value
      return value.length >= 5 && value.length <= 20;
    })
    .test('validIdentify', 'Identification should be alphanumeric', (value) => {
      if (!value) return true;
      return /^[a-zA-Z0-9]+$/.test(value);
    }),
  dob: yup
    .string()
    .nullable()
    .notRequired()
    .test('validDate', 'Invalid date format', (value) => {
      if (!value) return true;
      return !isNaN(Date.parse(value));
    })
    .test('notFutureDate', 'Date cannot be in the future', (value) => {
      if (!value) return true;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
      return selectedDate <= today;
    }),
  taxNo: yup
    .string()
    .nullable()
    .notRequired()
    .test('validTaxNoLength', 'Tax number should be between 8-15 digits', (value) => {
      if (!value) return true; // Allow empty value
      return value.length >= 8 && value.length <= 15;
    })
    .test('validTaxNo', 'Tax number should contain only digits', (value) => {
      if (!value) return true;
      return /^\d+$/.test(value);
    }),
  address: yup
    .string()
    .nullable()
    .notRequired()
    .matches(excludeEmojiPattern, 'Address cannot contain emojis')
    .test('validAddressLength', 'Address should be between 5-200 characters', (value) => {
      if (!value) return true; // Allow empty value
      return value.length >= 5 && value.length <= 200;
    }),
  email: yup
    .string()
    .nullable()
    .notRequired()
    .matches(excludeEmojiPattern, 'Email cannot contain emojis')
    .test('validEmailLength', 'Email should be between 5-100 characters', (value) => {
      if (!value) return true; // Allow empty value
      return value.length >= 5 && value.length <= 100;
    })
    .test('validEmail', 'Invalid email format', (value) => {
      if (!value) return true;
      return yup.string().email().isValidSync(value);
    }),
  phone: yup
    .string()
    .nullable()
    .notRequired()
    .test('isValidPhone', 'Phone must contain only digits and be between 10-15 digits', (value) => {
      if (!value) return true;
      const digitsOnly = value.replace(/\D/g, '');
      return /^\d+$/.test(value) && digitsOnly.length >= 10 && digitsOnly.length <= 15;
    }),
  description: yup
    .string()
    .nullable()
    .notRequired()
    .test('validDescriptionLength', 'Description should be between 0-500 characters', (value) => {
      if (!value) return true; // Allow empty value
      return value.length <= 500;
    }),
  parentId: yup.string().nullable().notRequired(),
  bankAccount: yup
    .string()
    .nullable()
    .notRequired()
    .matches(excludeEmojiPattern, 'Bank account cannot contain emojis'),
});

export const defaultPartnerFormValue = {
  name: '',
  logo: null,
  identify: null,
  dob: null,
  taxNo: null,
  address: null,
  email: null,
  phone: null,
  description: null,
  parentId: null,
  bankAccount: null,
};

export type PartnerFormValues = yup.InferType<typeof partnerSchema>;

export { partnerSchema };
