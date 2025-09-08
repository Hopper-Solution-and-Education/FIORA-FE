'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ContactInfoFormProps {
  profile?: {
    email?: string;
    phone?: string | null;
  };
  isSendingOtp?: boolean;
  isLoadingProfile?: boolean;
  eKYCData?: any;
  onSendOtp: (type: 'email' | 'phone') => void;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({
  profile,
  isSendingOtp,
  isLoadingProfile,
  eKYCData,
  onSendOtp,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="flex gap-2">
          <Input
            id="email"
            type="email"
            value={profile?.email}
            className="flex-1"
            readOnly
            disabled={isLoadingProfile}
          />

          <Button
            onClick={() => onSendOtp('email')}
            variant="outline"
            size="sm"
            className="px-6 py-4 min-w-28 disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={!!eKYCData || isSendingOtp}
          >
            {isSendingOtp ? <Icons.spinner className="animate-spin h-5 w-5" /> : 'Send OTP'}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <div className="flex gap-2">
          <Input
            id="phone"
            value={profile?.phone || ''}
            className="flex-1"
            readOnly
            disabled={isLoadingProfile}
          />
          <Button
            onClick={() => onSendOtp('phone')}
            variant="outline"
            size="sm"
            className="px-6 py-4 min-w-28 disabled:bg-gray-200 disabled:cursor-not-allowed"
            disabled={!!eKYCData || isSendingOtp}
          >
            {isSendingOtp ? <Icons.spinner className="animate-spin h-5 w-5" /> : 'Send OTP'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoForm;
