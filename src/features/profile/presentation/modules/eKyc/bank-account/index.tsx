'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserProfile } from '@/features/profile/domain/entities/models/profile';
import { Building2, CheckCircle, CreditCard, FileText, HelpCircle, Upload } from 'lucide-react';
import { FC, useState } from 'react';

type Props = {
  profile: UserProfile;
  isVerified: boolean;
};

const BankAccountForm: FC<Props> = ({ profile, isVerified }) => {
  const [accountType, setAccountType] = useState('');
  const [bankName, setBankName] = useState('');
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Bank Account Information
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Add your bank account details for secure transactions
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Account Details Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base sm:text-lg">Account Details</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Your bank information is encrypted and secured. We use this information only
                      for verification and transaction purposes.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="account-holder" className="text-sm font-medium">
                    Account Holder Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="account-holder"
                    placeholder="Enter full name as on bank account"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank-name" className="text-sm font-medium">
                    Bank Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bank-name"
                    placeholder="Enter your bank name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="account-number" className="text-sm font-medium">
                    Account Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="account-number"
                    placeholder="Enter your account number"
                    className="font-mono h-11"
                    type="password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routing-number" className="text-sm font-medium">
                    Routing Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="routing-number"
                    placeholder="Enter routing/sort code"
                    className="font-mono h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account-type" className="text-sm font-medium">
                  Account Type <span className="text-red-500">*</span>
                </Label>
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Checking Account
                      </div>
                    </SelectItem>
                    <SelectItem value="savings">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Savings Account
                      </div>
                    </SelectItem>
                    <SelectItem value="business">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Business Account
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base sm:text-lg">Bank Statement</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-1">
                      <p>Document Requirements:</p>
                      <ul className="text-xs space-y-1">
                        <li>• Document should be in good condition and clearly visible</li>
                        <li>• Ensure there is no light glare or shadows</li>
                        <li>• Statement should be from the last 3 months</li>
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
                    id="bank-statement-upload"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="bank-statement-upload" className="cursor-pointer">
                    {uploadedFile ? (
                      <div className="space-y-3">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            File uploaded successfully!
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
                          <p className="text-sm font-medium">Upload your bank statement</p>
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
          <div className="flex flex-col sm:flex-row gap-3 pb-4">
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

export default BankAccountForm;
