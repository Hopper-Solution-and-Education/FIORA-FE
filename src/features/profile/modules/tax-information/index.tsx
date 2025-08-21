/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Upload } from 'lucide-react';
import { useState } from 'react';

const TaxInformationForm = () => {
  const [taxResidency, setTaxResidency] = useState('');
  const [hasOtherTaxObligations, setHasOtherTaxObligations] = useState(false);
  const [isUSPerson, setIsUSPerson] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tax Information</h1>
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tax-code">Tax code</Label>
          <Input id="tax-code" placeholder="2749448264" value="2749448264" className="font-mono" />
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

        {/* Tax Registration Certificate Upload */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Tax Registration Certificate</Label>
          <div className="max-w-2xl">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-muted-foreground/50 transition-colors">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="tax-document-upload"
              />
              <label htmlFor="tax-document-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Please upload images of your tax certificate
                  </p>
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

export default TaxInformationForm;
