import { useContext } from 'react';
import { WalletSettingContext } from '../context';

export const useWalletSettingContext = () => {
  const context = useContext(WalletSettingContext);
  if (context === undefined) {
    throw new Error('useWalletSettingContext must be used within a WalletSettingProvider');
  }
  return context;
};
