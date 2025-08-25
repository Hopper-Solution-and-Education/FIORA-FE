'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/shared/utils';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { KYC_TABS } from '../constant';
import BankAccountForm from './bank-account';
import ContactInformationForm from './contact-information';
import IdentificationDocumentForm from './identification-document';
import TaxInformationForm from './tax-information';

const tabItems = [
  {
    id: 'identification-document',
    label: 'Identification Document',
    component: IdentificationDocumentForm,
    status: 'completed' as const,
  },
  {
    id: 'contact-information',
    label: 'Contact Information',
    component: ContactInformationForm,
    status: 'completed' as const,
  },
  {
    id: 'tax-information',
    label: 'Tax Information',
    component: TaxInformationForm,
    status: 'completed' as const,
  },
  {
    id: 'bank-account',
    label: 'Bank Accounts',
    component: BankAccountForm,
    status: 'pending' as const,
  },
];

const getStatusColor = (tabId: string, status: string, activeTab: string) => {
  if (activeTab === tabId) {
    return 'border-blue-500 text-blue-700 bg-blue-50';
  }
  if (status === 'completed') {
    return 'border-green-500 text-green-700 bg-green-50';
  }
  return 'border-muted-foreground/30 text-muted-foreground bg-background';
};

const getStatusIcon = (status: string) => {
  if (status === 'completed') {
    return '✓';
  }
  return '';
};

const KYCPage = () => {
  const [activeTab, setActiveTab] = useState<string>(KYC_TABS.IDENTIFICATION_DOCUMENT);

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (id) {
      setActiveTab(id as string);
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-[2vw] relative">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          orientation="vertical"
          className="w-full"
        >
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Vertical Tabs List */}
            <div className="w-full lg:w-80 lg:flex-shrink-0 lg:sticky lg:top-4 lg:self-start z-10">
              <Card>
                <CardContent className="p-4">
                  <TabsList className="h-auto w-full bg-transparent p-0 flex-col justify-start">
                    <div className="space-y-2 w-full">
                      {tabItems.map((tab, index) => (
                        <div key={tab.id} className="relative">
                          {/* Timeline connector line */}
                          {index < tabItems.length - 1 && (
                            <div
                              className={cn(
                                'absolute left-[35px] top-12 w-0.5 h-11',
                                tab.status === 'completed' ? 'bg-green-500' : 'bg-border',
                              )}
                            />
                          )}

                          <TabsTrigger
                            value={tab.id}
                            className={cn(
                              'w-full justify-start p-0 h-auto bg-transparent border-0 text-left relative z-2',
                              'hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200',
                              'data-[state=active]:bg-primary/10 data-[state=active]:text-primary',
                            )}
                          >
                            <div className="flex items-center space-x-4 p-3 w-full">
                              {/* Step number circle */}
                              <div
                                className={cn(
                                  'flex items-center justify-center w-12 h-12 rounded-full border-2 text-sm font-semibold transition-all duration-200 flex-shrink-0',
                                  getStatusColor(tab.id, tab.status, activeTab),
                                )}
                              >
                                {getStatusIcon(tab.status) || String(index + 1).padStart(2, '0')}
                              </div>

                              <span className="font-semibold text-base mb-1 leading-tight">
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
                    <Component />
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
