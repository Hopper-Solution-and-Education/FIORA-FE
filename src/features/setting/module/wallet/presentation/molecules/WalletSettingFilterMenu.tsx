import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DepositRequestStatus } from '../../domain';
import { WALLET_SETTING_FILTER_OPTIONS } from '../../data/constant';

interface WalletSettingFilterMenuProps {
  value: DepositRequestStatus | 'all';
  onChange: (value: DepositRequestStatus | 'all') => void;
  className?: string;
}

const WalletSettingFilterMenu = ({ value, onChange, className }: WalletSettingFilterMenuProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-[180px] ${className || ''}`}>
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        {WALLET_SETTING_FILTER_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default WalletSettingFilterMenu;
