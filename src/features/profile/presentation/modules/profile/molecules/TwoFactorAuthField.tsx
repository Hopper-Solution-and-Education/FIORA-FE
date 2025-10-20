'use client';

import { AlertCircle } from 'lucide-react';

// interface TwoFactorAuthFieldProps {
//   isEnabled: boolean;
//   onToggle: (enabled: boolean) => void;
// }

export const TwoFactorAuthField = () => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-normal text-gray-900">Set Up Google Authenticator</h4>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2.5 flex-1">
          <AlertCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-xs max-w-[50%] text-gray-500 leading-relaxed">
            Protect your account with Two-Factor Authentication (2FA). Every time you sign in,
            you&apos;ll need to enter a verification code from the Google Authenticator app on your
            phone.
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {/* {isEnabled ? '2FA is active' : ''} */}
          </span>
          {/* <Switch checked={isEnabled} onCheckedChange={onToggle} /> */}
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuthField;
