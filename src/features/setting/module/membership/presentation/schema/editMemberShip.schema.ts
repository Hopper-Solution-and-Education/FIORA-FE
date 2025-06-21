import * as yup from 'yup';

export const editMemberShipSchema = yup.object({
  id: yup.string().optional(),
  tier: yup.string().required('Tier is required'),
  referralBonus: yup
    .number()
    .required('Referral bonus is required')
    .min(0, 'Referral bonus must be positive')
    .max(100, 'Referral bonus must be less than 100'),
  savingInterest: yup
    .number()
    .required('Saving interest is required')
    .min(0, 'Saving interest must be positive')
    .max(100, 'Saving interest must be less than 100'),
  stakingInterest: yup
    .number()
    .required('Staking interest is required')
    .min(0, 'Staking interest must be positive')
    .max(100, 'Staking interest must be less than 100'),
  investmentInterest: yup
    .number()
    .required('Investment interest is required')
    .min(0, 'Investment interest must be positive')
    .max(100, 'Investment interest must be less than 100'),
  loanInterest: yup
    .number()
    .required('Loan interest is required')
    .min(0, 'Loan interest must be positive')
    .max(100, 'Loan interest must be less than 100'),
  cashback: yup
    .number()
    .required('Cashback is required')
    .min(0, 'Cashback must be positive')
    .max(100, 'Cashback must be less than 100'),
  referralKickback: yup
    .number()
    .required('Referral kickback is required')
    .min(0, 'Referral kickback must be positive')
    .max(100, 'Referral kickback must be less than 100'),
  bnplFee: yup.number().required('BNPL fee is required').min(0, 'BNPL fee must be positive'),
  story: yup.string().required('Story is required'),
  activeIcon: yup.string().required('Active icon is required'),
  inActiveIcon: yup.string().required('inActive Icon is required'),
  themeIcon: yup.string().required('Theme Icon is required'),
  mainIcon: yup.string().required('Main Icon is required'),
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
  mainIcon: '',
};
