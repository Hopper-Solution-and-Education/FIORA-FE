// src/features/setting/module/partner/presentation/schema/updatePartner.schema.ts
import * as yup from 'yup';

export const updatePartnerSchema = yup.object({
  name: yup.string().required('Name is required').max(50, 'Maximum 50 characters'),
  logo: yup.mixed().nullable().notRequired(),
  identify: yup
    .string()
    .nullable()
    .notRequired()
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
    .test('validTaxNo', 'Tax number should contain only digits', (value) => {
      if (!value) return true;
      return /^\d+$/.test(value);
    }),
  address: yup
    .string()
    .nullable()
    .notRequired()
    .max(200, 'Address must be less than 200 characters'),
  email: yup
    .string()
    .nullable()
    .notRequired()
    .test('validEmail', 'Invalid email format', (value) => {
      if (!value) return true;
      return yup.string().email().isValidSync(value);
    }),
  phone: yup
    .string()
    .nullable()
    .notRequired()
    .test('isValidPhone', 'Phone must contain only digits and be at least 10 digits', (value) => {
      if (!value) return true;
      const digitsOnly = value.replace(/\D/g, '');
      return /^\d+$/.test(value) && digitsOnly.length >= 10; // Ensure only digits and minimum length
    }),
  description: yup.string().nullable().notRequired().max(500, 'Maximum 500 characters'),
  parentId: yup.string().nullable().notRequired(),
});

export const defaultUpdatePartnerFormValue = {
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
};

export type UpdatePartnerFormValues = yup.InferType<typeof updatePartnerSchema>;
