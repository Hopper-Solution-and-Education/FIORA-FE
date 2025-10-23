'use client';

import { FC, ReactNode } from 'react';

interface SettingSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export const SettingSection: FC<SettingSectionProps> = ({ title, children, className = '' }) => {
  return (
    <div className={className}>
      <h3 className="text-base font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export default SettingSection;
