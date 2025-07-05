import React from 'react';
import { WalletSettingSearch } from '../molecules';

interface WalletSettingTopBarActionProps {
  className?: string;
}

const WalletSettingTopBarAction: React.FC<WalletSettingTopBarActionProps> = ({ className }) => {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <WalletSettingSearch value="" onChange={() => {}} />
      {/* <WalletSettingFilterMenu
        value={status}
        onChange={() => {}}
      /> */}
    </div>
  );
};

export default WalletSettingTopBarAction;
