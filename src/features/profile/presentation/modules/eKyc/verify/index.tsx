'use client';

import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { STATUS_COLOR } from '@/features/profile/constant';
import { eKYC, EKYCStatus, EKYCType } from '@/features/profile/domain/entities/models/profile';
import { useGetEKYCByUserIdQuery } from '@/features/profile/store/api/profileApi';
import { cn } from '@/shared/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { KYCPageType } from '../types';
import BankAccountVerifyForm from './BankAccountVerifyForm';
import ContactInformationVerifyForm from './ContactInformationVerifyForm';
import { useVerifyKYC } from './hooks/useVerifyKYC';
import IdentificationDocumentVerifyForm from './IdentificationDocumentVerifyForm';
import TaxInformationVerifyForm from './TaxInformationVerifyForm';

const VerifyKYCPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const userId = params?.userid as string;
  const id = searchParams?.get('id') ?? KYCPageType.identificationDocument;
  const { data: eKYCDataResponse, isLoading: isLoadingEKYCData } = useGetEKYCByUserIdQuery(userId);
  const [remarks, setRemarks] = useState('');

  const eKYCData = useMemo(() => {
    const getData = (type: EKYCType): eKYC | null => {
      return eKYCDataResponse?.find((item: eKYC) => item.type === type) || null;
    };
    return {
      contactInformation: getData(EKYCType.CONTACT_INFORMATION),
      identificationDocument: getData(EKYCType.IDENTIFICATION_DOCUMENT),
      taxInformation: getData(EKYCType.TAX_INFORMATION),
      bankAccount: getData(EKYCType.BANK_ACCOUNT),
    };
  }, [eKYCDataResponse]);

  // Get current active eKYC data
  const currentEKYCData = useMemo(() => {
    switch (id) {
      case KYCPageType.identificationDocument:
        return eKYCData.identificationDocument;
      case KYCPageType.contactInformation:
        return eKYCData.contactInformation;
      case KYCPageType.taxInformation:
        return eKYCData.taxInformation;
      case KYCPageType.bankAccount:
        return eKYCData.bankAccount;
      default:
        return null;
    }
  }, [id, eKYCData]);

  // Use verify hook
  const {
    modalOpen,
    setModalOpen,
    modalType,
    isVerifying,
    handleOpenApprove,
    handleOpenReject,
    handleVerify,
  } = useVerifyKYC({
    kycId: currentEKYCData?.id,
  });

  const getStatusCircle = useCallback((status: EKYCStatus | undefined) => {
    if (!status) {
      return 'border-muted-foreground/30 text-muted-foreground bg-background';
    }

    return `${STATUS_COLOR[status].color} ${STATUS_COLOR[status].borderColor} ${STATUS_COLOR[status].textColor}`;
  }, []);

  const getStatusColor = useCallback((status?: EKYCStatus) => {
    if (!status) {
      return 'bg-gray-200';
    }

    return STATUS_COLOR[status].color;
  }, []);

  const getStatusIcon = useCallback((status: string, index: number) => {
    if (status === EKYCStatus.APPROVAL || status === EKYCStatus.PENDING) {
      return <CheckCircle className="h-4 w-4" />;
    }

    if (status === EKYCStatus.REJECTED) {
      return <XCircle className="h-4 w-4" />;
    }

    return '0' + (index + 1);
  }, []);

  const tabItems = [
    {
      id: KYCPageType.identificationDocument,
      label: 'Identification Document',
      component: IdentificationDocumentVerifyForm,
      eKYCData: eKYCData.identificationDocument,
    },
    {
      id: KYCPageType.contactInformation,
      label: 'Contact Information',
      component: ContactInformationVerifyForm,
      eKYCData: eKYCData.contactInformation,
    },
    {
      id: KYCPageType.taxInformation,
      label: 'Tax Information',
      component: TaxInformationVerifyForm,
      eKYCData: eKYCData.taxInformation,
    },
    {
      id: KYCPageType.bankAccount,
      label: 'Bank Accounts',
      component: BankAccountVerifyForm,
      eKYCData: eKYCData.bankAccount,
    },
  ];

  if (isLoadingEKYCData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 sm:px-6 lg:px-8">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8">
        <Tabs
          value={id}
          onValueChange={(value) => {
            router.replace(`/ekyc/${userId}/verify?id=${value}`);
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
                                getStatusColor(tab.eKYCData?.status as EKYCStatus | undefined),
                              )}
                            />
                          )}

                          <TabsTrigger
                            value={tab.id}
                            className={cn(
                              'w-full justify-start p-0 h-auto bg-transparent border-0 text-left relative',
                              'data-[state=active]:bg-primary/10 data-[state=active]:text-primary',
                            )}
                          >
                            <div className="flex items-center space-x-3 p-2 sm:p-3 w-full">
                              {/* Step number circle */}
                              <div
                                className={cn(
                                  'flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 text-xs sm:text-sm font-semibold transition-all duration-200 flex-shrink-0',
                                  getStatusCircle(tab.eKYCData?.status as EKYCStatus | undefined),
                                )}
                              >
                                {getStatusIcon(tab.eKYCData?.status as string, index)}
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
                      eKYCData={tab.eKYCData as eKYC}
                      userId={userId}
                      onApprove={handleOpenApprove}
                      onReject={handleOpenReject}
                      isVerifying={isVerifying}
                    />
                  </TabsContent>
                );
              })}
            </div>
          </div>
        </Tabs>
      </div>

      {/* Global Dialog for Approve/Reject */}
      <GlobalDialog
        open={modalOpen}
        onOpenChange={(open) => {
          if (!isVerifying) {
            setModalOpen(open);
            if (!open) {
              setRemarks('');
            }
          }
        }}
        title={modalType === 'approve' ? 'Approve KYC Request' : 'Reject KYC Request'}
        description={
          modalType === 'approve'
            ? 'This action will mark the KYC status as "Approved", and the user will be considered verified. Please ensure all submitted information and documents have been carefully reviewed.'
            : 'This action will mark the KYC status as "Rejected". The user will be notified and may be required to re-submit their documents.'
        }
        variant={modalType === 'approve' ? 'info' : 'danger'}
        type={modalType === 'approve' ? 'info' : 'danger'}
        confirmText={modalType === 'approve' ? 'Approve' : 'Reject'}
        cancelText="Cancel"
        onConfirm={() => handleVerify(modalType === 'reject' ? remarks : undefined)}
        isLoading={isVerifying}
        renderContent={
          modalType === 'reject'
            ? () => (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">
                    Remarks (Optional)
                  </Label>
                  <Textarea
                    id="remarks"
                    placeholder="Enter the reason for rejection"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={4}
                    disabled={isVerifying}
                    className="resize-none text-sm"
                  />
                </div>
              )
            : undefined
        }
      />
    </div>
  );
};

export default VerifyKYCPage;
