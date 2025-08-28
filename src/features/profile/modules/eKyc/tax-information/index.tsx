'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calculator, CheckCircle, FileText, HelpCircle, Upload } from 'lucide-react';
import { useState } from 'react';

const TaxInformationForm = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calculator className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Tax Information
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Provide your tax details for compliance and reporting purposes
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Tax Details Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <CardTitle className="text-base sm:text-lg">Tax Details</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Tax information is required for regulatory compliance and may affect your
                      account features and limits.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="tax-code" className="text-sm font-medium">
                    Tax Identification Number <span className="text-red-500">*</span>
                  </Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This could be your SSN, TIN, or equivalent tax identifier</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="tax-code"
                  placeholder="Enter your tax ID number"
                  defaultValue="2749448264"
                  className="font-mono h-11"
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Upload Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base sm:text-lg">Tax Registration Certificate</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p>Document Requirements:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Document should be in good condition and clearly visible</li>
                        <li>• Ensure there is no light glare or shadows on the document</li>
                        <li>• Certificate should be current and not expired</li>
                        <li>• All text and official seals must be readable</li>
                        <li>• File size should not exceed 5MB</li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-w-full">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    uploadedFile
                      ? 'border-green-300 bg-green-50'
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/20'
                  }`}
                >
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="tax-document-upload"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="tax-document-upload" className="cursor-pointer">
                    {uploadedFile ? (
                      <div className="space-y-3">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Tax certificate uploaded successfully!
                          </p>
                          <p className="text-xs text-green-600 mt-1">{uploadedFile.name}</p>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          Replace File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            Upload your tax registration certificate
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Drag and drop or click to browse (JPG, PNG, or PDF, max 5MB)
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
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

export default TaxInformationForm;
