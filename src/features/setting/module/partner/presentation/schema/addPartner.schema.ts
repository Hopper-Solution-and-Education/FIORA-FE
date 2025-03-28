import * as yup from 'yup';

const partnerSchema = yup.object({
  name: yup.string().required('Name is required').max(50, 'Maximum 50 characters'),
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
      if (!value) return true; // Cho phép bỏ trống
      return value.replace(/\D/g, '').length >= 10; // Chỉ kiểm tra nếu có số
    }),
  description: yup.string().max(500, 'Maximum 500 characters').nullable().notRequired(),
  parentId: yup.string().nullable().notRequired(),
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
};

export type PartnerFormValues = yup.InferType<typeof partnerSchema>;

export { partnerSchema };
