'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserProfile } from '@/features/profile/domain/entities/models/profile';
import { CheckCircle, CreditCard, FileText, HelpCircle, Upload, User } from 'lucide-react';
import { FC, useState } from 'react';

type Props = {
  profile: UserProfile;
};

const IdentificationDocumentForm: FC<Props> = ({ profile }) => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [facePhoto, setFacePhoto] = useState<File | null>(null);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'front' | 'back' | 'face',
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === 'front') {
        setFrontImage(file);
      } else if (type === 'back') {
        setBackImage(file);
      } else {
        setFacePhoto(file);
      }
    }
  };

  const renderUploadArea = (
    id: string,
    title: string,
    file: File | null,
    type: 'front' | 'back' | 'face',
    className: string = '',
  ) => (
    <div className={`space-y-4 ${className}`}>
      <Label className="text-base font-medium">{title}</Label>
      <div
        className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-200 ${
          file
            ? 'border-green-300 bg-green-50'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20'
        }`}
      >
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => handleFileUpload(e, type)}
          className="hidden"
          id={id}
        />
        <label htmlFor={id} className="cursor-pointer">
          {file ? (
            <div className="space-y-3">
              <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">File uploaded successfully!</p>
                <p className="text-xs text-green-600 mt-1 truncate">{file.name}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2">
                Replace File
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Upload {title.toLowerCase()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag and drop or click to browse (JPG, PNG, or PDF, max 5MB)
                </p>
              </div>
            </div>
          )}
        </label>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Identity Verification
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Upload your identification documents for account verification
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Document Details */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-base sm:text-lg">Document Information</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Your documents are encrypted and securely processed. We use this information
                      only for identity verification as required by law.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="id-number" className="text-sm font-medium">
                    Document Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="id-number"
                    placeholder="Enter document number"
                    defaultValue="013837612892"
                    className="font-mono h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issued-date" className="text-sm font-medium">
                    Issue Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="issued-date"
                    placeholder="MM/DD/YYYY"
                    defaultValue="08/04/2021"
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="place-issuance" className="text-sm font-medium">
                  Place of Issuance <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="place-issuance"
                  placeholder="Enter the issuing authority or location"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Address on Document <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  placeholder="Enter address as shown on document"
                  className="h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Upload Sections */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base sm:text-lg">Document Images</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p>Document Requirements:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Document should be in good condition and clearly visible</li>
                        <li>• Ensure there is no light glare, shadows, or reflections</li>
                        <li>• Do not use screenshots or photocopies</li>
                        <li>• All text and details must be readable</li>
                        <li>• File size should not exceed 5MB per document</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Front and Back Side */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {renderUploadArea('front-upload', 'Front Side of Document', frontImage, 'front')}
                  {renderUploadArea('back-upload', 'Back Side of Document', backImage, 'back')}
                </div>

                {/* Face Photo */}
                <div className="max-w-md mx-auto xl:mx-0">
                  {renderUploadArea('face-upload', 'Portrait Photo', facePhoto, 'face')}
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Upload a clear portrait photo for identity verification
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pb-4 ">
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

export default IdentificationDocumentForm;
