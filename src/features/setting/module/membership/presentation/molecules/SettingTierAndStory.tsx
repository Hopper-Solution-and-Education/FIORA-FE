'use client';

import React, { useState } from 'react';
import SettingTierInputField from '../atoms/SettingTierInputField';

const SettingTierAndStory = () => {
  const [settings, setSettings] = useState({
    referralBonus: '4',
    savingInterest: '9',
    stakingInterest: '14',
    investmentInterest: '22',
    loanInterest: '35',
    cashback: '9',
    referralKickback: '4',
    bnplFee: '0.2',
  });

  const handleSettingChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="space-y-6 col-span-2">
      {/* Settings Panel */}
      <div className="p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-3">Setting Tier: Platinum Qili</h2>
        <div className="max-w-2xl">
          <SettingTierInputField
            label="Referral Bonus"
            value={settings.referralBonus}
            onChange={(value) => handleSettingChange('referralBonus', value)}
            suffix="FX"
          />
          <SettingTierInputField
            label="Saving Interest"
            value={settings.savingInterest}
            onChange={(value) => handleSettingChange('savingInterest', value)}
            suffix="%/year"
            options={{ percent: true, maxPercent: 100 }}
          />
          <SettingTierInputField
            label="Staking Interest"
            value={settings.stakingInterest}
            onChange={(value) => handleSettingChange('stakingInterest', value)}
            suffix="%/year"
            options={{ percent: true, maxPercent: 100 }}
          />
          <SettingTierInputField
            label="Investment Interest"
            value={settings.investmentInterest}
            onChange={(value) => handleSettingChange('investmentInterest', value)}
            suffix="%/year"
            options={{ percent: true, maxPercent: 100 }}
          />
          <SettingTierInputField
            label="Loan Interest"
            value={settings.loanInterest}
            onChange={(value) => handleSettingChange('loanInterest', value)}
            suffix="%/year"
            options={{ percent: true, maxPercent: 100 }}
          />
          <SettingTierInputField
            label="Cashback"
            value={settings.cashback}
            onChange={(value) => handleSettingChange('cashback', value)}
            suffix="% total spent"
            options={{ percent: true, maxPercent: 100 }}
          />
          <SettingTierInputField
            label="Referral Kickback"
            value={settings.referralKickback}
            onChange={(value) => handleSettingChange('referralKickback', value)}
            suffix="% referral spent"
            options={{ percent: true, maxPercent: 100 }}
          />
          <SettingTierInputField
            label="BNPL Fee"
            value={settings.bnplFee}
            onChange={(value) => handleSettingChange('bnplFee', value)}
            suffix="FX/day"
          />
        </div>
      </div>

      {/* Story Section */}
      <div className="p-4 rounded-lg shadow h-52">
        <h2 className="text-xl font-bold mb-4">Story</h2>
        <p>This is the story of Platinum Qili</p>
      </div>
    </div>
  );
};

export default SettingTierAndStory;
