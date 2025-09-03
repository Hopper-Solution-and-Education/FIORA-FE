'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Check } from 'lucide-react';
import { FC } from 'react';

type ContactInfo = {
  email: string;
  phone: string;
};

type ContactInfoFormProps = {
  contactInfo: ContactInfo;
  onContactInfoChange: (contactInfo: ContactInfo) => void;
  onSendOtp: (type: 'email' | 'phone') => void;
  onBack?: () => void;
  onConfirm?: () => void;
};

const ContactInfoForm: FC<ContactInfoFormProps> = ({
  contactInfo,
  onContactInfoChange,
  onSendOtp,
  onBack,
  onConfirm,
}) => {
  const handleEmailChange = (email: string) => {
    onContactInfoChange({ ...contactInfo, email });
  };

  const handlePhoneChange = (phone: string) => {
    onContactInfoChange({ ...contactInfo, phone });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">Contact Info</CardTitle>
        <CardDescription>Lorem ipsum dolor sit amet, consectetur adipiscing elit</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="setting-email">Email</Label>
          <div className="flex gap-3">
            <Input
              id="setting-email"
              type="email"
              placeholder="you@example.com"
              aria-label="Email"
              value={contactInfo.email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="py-4"
              aria-label="Send email OTP"
              onClick={() => onSendOtp('email')}
            >
              Send OTP
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="setting-phone">Phone</Label>
          <div className="flex gap-3">
            <Input
              id="setting-phone"
              type="tel"
              placeholder="0123456789"
              aria-label="Phone"
              value={contactInfo.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="py-4"
              aria-label="Send phone OTP"
              onClick={() => onSendOtp('phone')}
            >
              Send OTP
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button type="button" variant="outline" aria-label="Back" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button type="button" aria-label="Confirm" onClick={onConfirm}>
            <Check className="mr-2 h-4 w-4" /> Confirm
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoForm;
