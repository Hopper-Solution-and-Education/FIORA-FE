import { Messages } from '@/shared/constants/message';
import * as Yup from 'yup';

export const basePartnerSchema = Yup.object({
  userId: Yup.string().uuid().required(Messages.INVALID_USER),
  email: Yup.string()
    .nullable()
    .optional()
    .max(50, Messages.EMAIL_TOO_LONG)
    .email(Messages.INVALID_EMAIL),
  phone: Yup.string()
    .nullable()
    .optional()
    .matches(/^\+?[1-9]\d{1,14}$/, {
      excludeEmptyString: true,
      message: Messages.INVALID_PHONE,
    })
    .min(10, Messages.INVALID_PHONE_LENGTH)
    .max(15, Messages.INVALID_PHONE_LENGTH),
  taxNo: Yup.string()
    .nullable()
    .optional()
    .max(20, Messages.TAX_NO_TOO_LONG)
    .matches(/^[0-9-]+$/, {
      excludeEmptyString: true,
      message: Messages.INVALID_TAX_NO,
    }),
  identify: Yup.string()
    .nullable()
    .optional()
    .max(50, Messages.IDENTIFY_TOO_LONG)
    .matches(/^[a-zA-Z0-9-]+$/, {
      excludeEmptyString: true,
      message: Messages.INVALID_IDENTIFY,
    }),
  name: Yup.string().max(255, Messages.NAME_TOO_LONG),
  description: Yup.string().nullable().optional().max(1000, Messages.DESCRIPTION_TOO_LONG),
  address: Yup.string().nullable().optional().max(255, Messages.ADDRESS_TOO_LONG),
  logo: Yup.string()
    .nullable()
    .optional()
    .matches(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, {
      excludeEmptyString: true,
      message: Messages.INVALID_LOGO_URL,
    }),
  dob: Yup.date()
    .nullable()
    .optional()
    .typeError(Messages.INVALID_DOB_FORMAT)
    .max(new Date(), Messages.INVALID_DOB)
    .test('not-too-old', Messages.DOB_TOO_OLD, (value) => {
      if (!value) return true;
      return new Date().getFullYear() - value.getFullYear() <= 150;
    }),
  parentId: Yup.string().uuid().nullable().optional(),
});
