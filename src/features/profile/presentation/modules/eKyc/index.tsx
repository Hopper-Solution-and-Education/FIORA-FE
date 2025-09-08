'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  EKYCStatus,
  EKYCType,
  UserProfile,
} from '@/features/profile/domain/entities/models/profile';
import { useGetProfileQuery } from '@/features/profile/store/api/profileApi';
import { cn } from '@/shared/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import BankAccountForm from './bank-account';
import ContactInformationForm from './contact-information';
import IdentificationDocumentForm from './identification-document';
import TaxInformationForm from './tax-information';
import { KYCPageType } from './types';

const getStatusCircle = (tabId: string, status: string, activeTab: string) => {
  if (activeTab === tabId) {
    return 'border-blue-500 text-blue-700 bg-blue-50';
  }
  if (status === EKYCStatus.APPROVAL) {
    return 'border-green-500 text-green-700 bg-green-50';
  }
  return 'border-muted-foreground/30 text-muted-foreground bg-background';
};

const getStatusColor = (status: string) => {
  if (status === EKYCStatus.APPROVAL) {
    return 'bg-green-500';
  }

  if (status === EKYCStatus.PENDING) {
    return 'bg-orange-500';
  }

  if (status === EKYCStatus.REJECTED) {
    return 'bg-red-500';
  }

  return 'bg-gray-200';
};

const getStatusIcon = (status: string, index: number) => {
  if (status === EKYCStatus.APPROVAL || status === EKYCStatus.PENDING) {
    return <CheckCircle className="h-4 w-4" />;
  }

  if (status === EKYCStatus.REJECTED) {
    return <XCircle className="h-4 w-4" />;
  }

  return '0' + (index + 1);
};

const KYCPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const id = params?.get('id') ?? KYCPageType.identificationDocument;
  const { data: profile } = useGetProfileQuery();

  const eKYCStatus = useMemo(() => {
    const getStatus = (type: EKYCType): string => {
      return profile?.eKYC?.find((item) => item.type === type)?.status || '';
    };
    return {
      contactInformation: getStatus(EKYCType.CONTACT_INFORMATION),
      identificationDocument: getStatus(EKYCType.IDENTIFICATION_DOCUMENT),
      taxInformation: getStatus(EKYCType.TAX_INFORMATION),
      bankAccount: getStatus(EKYCType.BANK_ACCOUNT),
    };
  }, [profile]);

  console.log('🚀 ~ KYCPage ~ eKYCStatus:', eKYCStatus);

  const tabItems = [
    {
      id: KYCPageType.identificationDocument,
      label: 'Identification Document',
      component: IdentificationDocumentForm,
      status: eKYCStatus.identificationDocument,
    },
    {
      id: KYCPageType.contactInformation,
      label: 'Contact Information',
      component: ContactInformationForm,
      status: eKYCStatus.contactInformation,
    },
    {
      id: KYCPageType.taxInformation,
      label: 'Tax Information',
      component: TaxInformationForm,
      status: eKYCStatus.taxInformation,
    },
    {
      id: KYCPageType.bankAccount,
      label: 'Bank Accounts',
      component: BankAccountForm,
      status: eKYCStatus.bankAccount,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Tabs
          value={id}
          onValueChange={(value) => {
            router.replace(`/profile/ekyc?id=${value}`);
          }}
          orientation="vertical"
          className="w-full"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Vertical Tabs List */}
            <div className="w-full lg:w-64 xl:w-72 lg:flex-shrink-0 lg:sticky lg:top-4 lg:self-start z-10">
              <Card className="shadow-sm">
                <CardContent className="p-3 sm:p-4">
                  <TabsList className="h-auto w-full bg-transparent p-0 flex-col justify-start">
                    <div className="space-y-1 sm:space-y-2 w-full">
                      {tabItems.map((tab, index) => (
                        <div key={tab.id} className="relative">
                          {/* Timeline connector line */}
                          {index < tabItems.length - 1 && (
                            <div
                              className={cn(
                                'absolute left-[23px] sm:left-[32px] top-10 sm:top-12 w-0.5 h-8 sm:h-10',
                                getStatusColor(tab.status as string),
                              )}
                            />
                          )}

                          <TabsTrigger
                            value={tab.id}
                            className={cn(
                              'w-full justify-start p-0 h-auto bg-transparent border-0 text-left relative',
                              // 'hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200',
                              'data-[state=active]:bg-primary/10 data-[state=active]:text-primary',
                            )}
                          >
                            <div className="flex items-center space-x-3 p-2 sm:p-3 w-full">
                              {/* Step number circle */}
                              <div
                                className={cn(
                                  'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 text-xs sm:text-sm font-semibold transition-all duration-200 flex-shrink-0',
                                  getStatusCircle(tab.id, tab.status as string, id),
                                )}
                              >
                                {getStatusIcon(tab.status as string, index)}
                              </div>

                              <span className="font-medium sm:font-semibold text-sm leading-tight">
                                {tab.label}
                              </span>
                            </div>
                          </TabsTrigger>
                        </div>
                      ))}
                    </div>
                  </TabsList>
                </CardContent>
              </Card>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-w-0">
              {tabItems.map((tab) => {
                const Component = tab.component;
                return (
                  <TabsContent
                    key={tab.id}
                    value={tab.id}
                    className="m-0 focus-visible:outline-none"
                  >
                    <Component
                      profile={profile as UserProfile}
                      isVerified={tab.status === EKYCStatus.APPROVAL}
                    />
                  </TabsContent>
                );
              })}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default KYCPage;
