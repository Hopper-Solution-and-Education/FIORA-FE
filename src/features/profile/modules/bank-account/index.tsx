'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Upload } from 'lucide-react';
import { useState } from 'react';

const BankAccountForm = () => {
  const [accountType, setAccountType] = useState('');
  const [bankName, setBankName] = useState('');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Bank Accounts</h1>
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="account-holder">Account Holder Name</Label>
          <Input id="account-holder" placeholder="Enter account holder name" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank-name">Bank Name</Label>
          <Input
            id="bank-name"
            placeholder="Enter bank name"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-number">Account Number</Label>
          <Input id="account-number" placeholder="Enter account number" className="font-mono" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="routing-number">Routing Number</Label>
          <Input id="routing-number" placeholder="Enter routing number" className="font-mono" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account-type">Account Type</Label>
          <Select value={accountType} onValueChange={setAccountType}>
            <SelectTrigger>
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">Checking Account</SelectItem>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="business">Business Account</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <p className="font-semibold">
            To avoid delays when verifying account, Please make sure bellow
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Document should be good condition and clearly visible.</p>
            <p>Make sure that there is no light glare on the card.</p>
          </div>
        </div>

        {/* Bank Statement Upload */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Bank Statement</Label>
          <div className="max-w-2xl">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-muted-foreground/50 transition-colors">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="bank-statement-upload"
              />
              <label htmlFor="bank-statement-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Please upload your bank statement</p>
                  <p className="text-xs text-muted-foreground">(JPG, PNG, or PDF, max 5MB)</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccountForm;
