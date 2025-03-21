'use client';

import BalanceChart from '@/components/common/BalanceChartV2';
import { CreateAccountModal } from './components/CreateAccountPage';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { TabComponentProps } from '../../types';

const AccountSettingDashboard = ({ title, description }: TabComponentProps) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <Button
            variant="default"
            className="flex items-center gap-2"
            size={'lg'}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-7 h-7" />
            Add Account
          </Button>
        </div>
        <BalanceChart />

        <CreateAccountModal
          isOpen={isCreateModalOpen}
          setIsCreateModalOpen={setIsCreateModalOpen}
          setTriggered={setIsTriggered}
          isTriggered={isTriggered}
        />
      </div>
    </div>
  );
};

export default AccountSettingDashboard;
