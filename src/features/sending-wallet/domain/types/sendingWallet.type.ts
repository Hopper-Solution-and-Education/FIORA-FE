import { Category, Otp, Partner, Product } from '@prisma/client';

export type AmountCurrencyType = {
  amount: number;
  currency?: string | null;
};

export type Reciever = Pick<Partner, 'email' | 'logo' | 'id' | 'name'>;

export type MovingLimitType = {
  dailyMovingLimit: AmountCurrencyType;
  oneTimeMovingLimit: AmountCurrencyType;
};

export type ArgCreateTransactionSendingType = {
  recieverEmail: string;
  userId: string;
  amount: number;
  categoryId?: string;
  productIds?: string[];
};

export type ArgGetPackageType = {
  availableLimit: number;
};

export type CategoryItemType = Pick<Category, 'id' | 'icon' | 'name'>;

export type ProductType = Pick<Product, 'id' | 'icon' | 'name'> & {
  category: { icon: string; name: string } | null;
};

export type ArgCreateOTP = Pick<Otp, 'duration' | 'otp' | 'type' | 'userId'>;

export type ArgVerifyOTP = Pick<Otp, 'otp' | 'userId'>;
