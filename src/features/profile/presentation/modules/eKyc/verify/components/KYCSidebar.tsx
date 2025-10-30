'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STATUS_COLOR } from '@/features/profile/constant';
import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { cn } from '@/shared/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import { FC, useCallback } from 'react';

interface TabItem {
  id: string;
  label: string;
  status?: EKYCStatus;
}

interface KYCSidebarProps {
  items: TabItem[];
}

export const KYCSidebar: FC<KYCSidebarProps> = ({ items }) => {
  const getStatusCircle = useCallback((status: EKYCStatus | undefined) => {
    if (!status) {
      return 'border-muted-foreground/30 text-muted-foreground bg-background';
    }
    return `${STATUS_COLOR[status].color} ${STATUS_COLOR[status].borderColor} ${STATUS_COLOR[status].textColor}`;
  }, []);

  const getStatusColor = useCallback((status?: EKYCStatus) => {
    if (!status) return 'bg-gray-200';
    return STATUS_COLOR[status].color;
  }, []);

  const getStatusIcon = useCallback((status?: EKYCStatus, index?: number) => {
    if (status === EKYCStatus.APPROVAL || status === EKYCStatus.PENDING) {
      return <CheckCircle className="h-4 w-4" />;
    }
    if (status === EKYCStatus.REJECTED) {
      return <XCircle className="h-4 w-4" />;
    }
    return '0' + ((index ?? 0) + 1);
  }, []);

  return (
    <div className="w-full lg:w-64 xl:w-72 lg:flex-shrink-0 lg:sticky lg:top-4 lg:self-start z-10">
      <Card className="shadow-sm">
        <CardContent className="p-3 sm:p-4">
          <TabsList className="h-auto w-full bg-transparent p-0 flex-col justify-start">
            <div className="space-y-1 sm:space-y-2 w-full">
              {items.map((tab, index) => (
                <div key={tab.id} className="relative">
                  {/* Timeline connector line */}
                  {index < items.length - 1 && (
                    <div
                      className={cn(
                        'absolute left-[23px] sm:left-[32px] top-10 sm:top-12 w-0.5 h-8 sm:h-10',
                        getStatusColor(tab.status),
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
                          getStatusCircle(tab.status),
                        )}
                      >
                        {getStatusIcon(tab.status, index)}
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
  );
};
