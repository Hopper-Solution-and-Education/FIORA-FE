/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, FileText, Upload } from 'lucide-react';
import { useState } from 'react';

const IdentificationDocumentForm = () => {
  const [documentType, setDocumentType] = useState('');
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = event.target.files?.[0];
    if (file) {
      if (side === 'front') {
        setFrontImage(file);
      } else {
        setBackImage(file);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Identification Document</h1>
        <div className="flex items-center gap-2 text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          In order to complete, please upload any of the following personal document.
        </p>

        {/* Document Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="flex items-center gap-3 p-4 border-2 border-green-200 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors"
            onClick={() => setDocumentType('national-id')}
          >
            <FileText className="h-6 w-6 text-green-600" />
            <span className="font-medium text-green-800">National card</span>
          </button>

          <button
            className="flex items-center gap-3 p-4 border-2 border-gray-200 bg-white rounded-lg text-left hover:bg-gray-50 transition-colors"
            onClick={() => setDocumentType('passport')}
          >
            <FileText className="h-6 w-6 text-gray-600" />
            <span className="font-medium">Passport</span>
          </button>

          <button
            className="flex items-center gap-3 p-4 border-2 border-gray-200 bg-white rounded-lg text-left hover:bg-gray-50 transition-colors"
            onClick={() => setDocumentType('business-license')}
          >
            <FileText className="h-6 w-6 text-gray-600" />
            <span className="font-medium">business license</span>
          </button>
        </div>

        {/* Document Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="id-number">ID number</Label>
            <Input
              id="id-number"
              placeholder="013837612892"
              value="013837612892"
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issued-date">Issued Date</Label>
            <Input id="issued-date" placeholder="08/04/2021" value="08/04/2021" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="place-issuance">Place of Issuance</Label>
          <Input
            id="place-issuance"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit"
          />
        </div>

        {/* Important Notice */}
        <div className="space-y-4">
          <p className="font-semibold">
            To avoid delays when verifying account, Please make sure bellow
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Document should be good condition and clearly visible.</p>
            <p>Make sure that there is no light glare on the card.</p>
            <p>Do not use screenshots or photocopies</p>
          </div>
        </div>

        {/* Document Upload Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Front Side */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Front side of the ID card</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-muted-foreground/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'front')}
                className="hidden"
                id="front-upload"
              />
              <label htmlFor="front-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Upload the front side of your National ID</p>
                  <p className="text-xs text-muted-foreground">(JPG, PNG, or PDF, max 5MB)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Back Side */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Back side of the ID card</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-muted-foreground/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'back')}
                className="hidden"
                id="back-upload"
              />
              <label htmlFor="back-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Upload the back side of your National ID</p>
                  <p className="text-xs text-muted-foreground">(JPG, PNG, or PDF, max 5MB)</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Face Photo */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Face photo</Label>
          <div className="max-w-md">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-muted-foreground/50 transition-colors">
              <input type="file" accept="image/*" className="hidden" id="face-upload" />
              <label htmlFor="face-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Please upload a portrait photo of yourself</p>
                  <p className="text-xs text-muted-foreground">(JPG or PNG, max 5MB)</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentificationDocumentForm;
