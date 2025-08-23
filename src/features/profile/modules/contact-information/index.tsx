'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, HelpCircle, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

const ContactInformationForm = () => {
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);

  const handleSendEmailOtp = () => {
    setEmailOtpSent(true);
    // Simulate OTP sending
    setTimeout(() => setEmailOtpSent(false), 3000);
  };

  const handleSendPhoneOtp = () => {
    setPhoneOtpSent(true);
    // Simulate OTP sending
    setTimeout(() => setPhoneOtpSent(false), 3000);
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Contact Information
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Verify your contact details for secure communication
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Email Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base sm:text-lg">Email Address</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your primary email for account notifications and security alerts</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      defaultValue="voanhphi@gmail.com"
                      className="h-11"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="px-6 h-11"
                    onClick={handleSendEmailOtp}
                    disabled={emailOtpSent}
                  >
                    {emailOtpSent ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Sent
                      </div>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phone Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base sm:text-lg">Phone Number</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your mobile number for SMS notifications and two-factor authentication</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      defaultValue="0317109704"
                      className="h-11"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="px-6 h-11"
                    onClick={handleSendPhoneOtp}
                    disabled={phoneOtpSent}
                  >
                    {phoneOtpSent ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Sent
                      </div>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button className="flex-1 sm:flex-none sm:px-8 h-11">Save & Continue</Button>
            <Button variant="outline" className="flex-1 sm:flex-none sm:px-8 h-11">
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ContactInformationForm;
