import * as yup from 'yup';

export const editMemberShipSchema = yup.object({
  tier: yup.string().required('Tier is required'),
  referralBonus: yup
    .number()
    .required('Referral bonus is required')
    .positive('Referral bonus must be positive'),
  savingInterest: yup
    .number()
    .required('Saving interest is required')
    .positive('Saving interest must be positive'),
  stakingInterest: yup
    .number()
    .required('Staking interest is required')
    .positive('Staking interest must be positive'),
  investmentInterest: yup
    .number()
    .required('Investment interest is required')
    .positive('Investment interest must be positive'),
  loanInterest: yup
    .number()
    .required('Loan interest is required')
    .positive('Loan interest must be positive'),
  cashback: yup.number().required('Cashback is required').positive('Cashback must be positive'),
  referralKickback: yup
    .number()
    .required('Referral kickback is required')
    .positive('Referral kickback must be positive'),
  bnplFee: yup.number().required('BNPL fee is required').positive('BNPL fee must be positive'),
  story: yup.string().required('Story is required'),
  activeIcon: yup.string().required('Active icon is required'),
  inActiveIcon: yup.string().required('inActive Icon is required'),
  themeIcon: yup.string().required('Theme Icon is required'),
});

export type EditMemberShipFormValues = yup.InferType<typeof editMemberShipSchema>;

export const defaultEditMemberShipValue: EditMemberShipFormValues = {
  tier: '',
  referralBonus: 0,
  savingInterest: 0,
  stakingInterest: 0,
  investmentInterest: 0,
  loanInterest: 0,
  cashback: 0,
  referralKickback: 0,
  bnplFee: 0,
  story: '',
  activeIcon: '',
  inActiveIcon: '',
  themeIcon: '',
};
