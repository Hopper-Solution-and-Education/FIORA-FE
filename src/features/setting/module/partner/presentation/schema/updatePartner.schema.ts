// src/features/setting/module/partner/presentation/schema/updatePartner.schema.ts
import * as yup from 'yup';

export const updatePartnerSchema = yup.object({
  name: yup.string().max(50, 'Maximum 50 characters').notRequired(),
  logo: yup.string().nullable().notRequired(),
  identify: yup.string().nullable().notRequired(),
  dob: yup.string().nullable().notRequired(),
  taxNo: yup.string().nullable().notRequired(),
  address: yup.string().nullable().notRequired(),
  email: yup.string().email('Invalid email').nullable().notRequired(),
  phone: yup
    .string()
    .nullable()
    .notRequired()
    .test('isValidPhone', 'Phone must be at least 10 digits', (value) => {
      if (!value) return true; // Allow empty
      return value.replace(/\D/g, '').length >= 10; // Check if digits >= 10
    }),
  description: yup.string().max(500, 'Maximum 500 characters').nullable().notRequired(),
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
