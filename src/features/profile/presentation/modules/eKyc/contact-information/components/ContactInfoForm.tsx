'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';

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
  if (isLoadingProfile) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
            <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
            <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
            <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
            <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Email Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Email Address</Label>
        <div className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Icons.mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-foreground truncate">
              {profile?.email || 'No email provided'}
            </span>
          </div>
          <div>
            {eKYCData && eKYCData?.status === EKYCStatus.APPROVAL ? (
              <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                <Icons.checkCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Verified
                </span>
              </div>
            ) : (
              <Button
                onClick={() => onSendOtp('email')}
                variant="outline"
                size="sm"
                className="ml-3 px-4 py-2 min-w-24 border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!!eKYCData || isSendingOtp || !profile?.email}
                type="button"
              >
                {isSendingOtp ? <Icons.spinner className="animate-spin h-4 w-4" /> : <>Send OTP</>}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Phone Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">Phone Number</Label>
        <div className="flex items-center justify-between p-3 bg-muted/30 dark:bg-muted/10 rounded-lg border border-border/50">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Icons.phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm font-medium text-foreground truncate">{profile?.phone}</span>
          </div>
          <Button
            onClick={() => onSendOtp('phone')}
            variant="outline"
            size="sm"
            className="ml-3 px-4 py-2 min-w-24 border-border hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={true}
            type="button"
          >
            Send OTP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoForm;
