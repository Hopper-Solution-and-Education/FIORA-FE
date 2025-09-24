import { WalletType } from '@prisma/client';
import Joi from 'joi';
import { SavingWalletAction } from '../constants/savingWallet';

export const transferSavingWalletBodySchema = Joi.object({
  packageFXId: Joi.string().uuid().required().messages({
    'any.required': 'packageFXId is required',
    'string.base': 'packageFXId must be a string',
  }),
  action: Joi.string()
    .valid(...Object.values(SavingWalletAction))
    .required()
    .messages({
      'any.required': 'action is required',
      'string.base': 'action must be a string',
      'any.only': 'action does not match',
    }),
});
export const claimsSavingWalletBodySchema = Joi.object({
  packageFXId: Joi.string().uuid().required().messages({
    'any.required': 'packageFXId is required',
    'string.base': 'packageFXId must be a string',
  }),
  walletType: Joi.string().valid(WalletType.Payment, WalletType.Saving).required().messages({
    'any.required': 'walletType is required',
    'string.base': 'walletType must be a string',
    'any.only': 'walletType must be either Payment or Saving',
  }),
});
