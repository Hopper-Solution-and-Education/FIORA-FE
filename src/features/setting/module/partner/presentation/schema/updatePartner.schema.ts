// src/features/setting/module/partner/presentation/schema/updatePartner.schema.ts
import * as yup from 'yup';

export const updatePartnerSchema = yup.object({
  name: yup.string().max(50, 'Maximum 50 characters').notRequired(),
  logo: yup.mixed().nullable().notRequired(),
  identify: yup.string().nullable().notRequired(),
  dob: yup.string().nullable().notRequired(),
  taxNo: yup.string().nullable().notRequired(),
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
  phone: yup.string().nullable().notRequired(),
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
