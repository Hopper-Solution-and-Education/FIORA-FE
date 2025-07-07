'use client';

import { createContext, ReactNode } from 'react';
import { DepositRequestStatus } from '../../domain/enum';

interface WalletSettingContextType {
  handleUpdateStatus: (id: string, status: DepositRequestStatus) => Promise<void>;
}

export const WalletSettingContext = createContext<WalletSettingContextType | undefined>(undefined);

interface WalletSettingProviderProps {
  children: ReactNode;
  value: WalletSettingContextType;
}

export const WalletSettingProvider = ({ children, value }: WalletSettingProviderProps) => {
  return <WalletSettingContext.Provider value={value}>{children}</WalletSettingContext.Provider>;
};
