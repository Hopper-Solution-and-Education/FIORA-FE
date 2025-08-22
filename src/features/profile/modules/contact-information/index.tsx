'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

const ContactInformationForm = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Contact Info</h1>
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="voanhphi@gmail.com"
              value="voanhphi@gmail.com"
              className="flex-1"
            />
            <Button variant="outline" size="sm" className="px-6">
              Send OTP
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <div className="flex gap-2">
            <Input id="phone" placeholder="0317109704" value="0317109704" className="flex-1" />
            <Button variant="outline" size="sm" className="px-6">
              Send OTP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInformationForm;
