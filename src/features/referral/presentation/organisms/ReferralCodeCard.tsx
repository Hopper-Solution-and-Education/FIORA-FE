'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BriefcaseBusiness, Copy, UserPlus, Users, Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { useReferralCode } from '../hooks';

interface ReferralCodeCardProps {
  referralCode?: string | null;
  onInviteClick?: () => void;
  onWithdrawClick?: () => void;
  onViewReferees?: () => void;
}

type ActionKey = 'invite' | 'withdraw' | 'listOfReferees' | 'copy-code';

type ActionConfig = {
  key: ActionKey;
  icon: typeof UserPlus;
  label: string;
  color: string;
};

const ReferralCodeCard = ({
  referralCode: referralCodeFromServer,
  onInviteClick,
  onWithdrawClick,
  onViewReferees,
}: ReferralCodeCardProps) => {
  const { referralCode } = useReferralCode(referralCodeFromServer);

  const actions = useMemo(() => {
    const base: ActionConfig[] = [
      {
        key: 'invite',
        icon: UserPlus,
        label: 'Invite friends',
        color: '!text-blue-500',
      },

      {
        key: 'listOfReferees',
        icon: BriefcaseBusiness,
        label: 'List of referees',
        color: '!text-yellow-500',
      },
    ];

    if (onWithdrawClick) {
      base.splice(2, 0, {
        key: 'withdraw',
        icon: Wallet,
        label: 'Claim',
        color: '!text-red-500',
      });
    }

    if (!onInviteClick) {
      return base.filter((action) => action.key !== 'invite');
    }

    return base;
  }, [onInviteClick, onWithdrawClick]);

  const handleAction = async (key: ActionKey) => {
    try {
      if (key === 'invite') {
        onInviteClick?.();
        return;
      }

      if (key === 'withdraw') {
        onWithdrawClick?.();
        return;
      }

      if (key === 'listOfReferees') {
        onViewReferees?.();
        return;
      }

      if (key === 'copy-code') {
        if (referralCode) {
          await navigator.clipboard.writeText(referralCode);
          toast.success('Referral code copied to clipboard');
        } else {
          toast.error('No referral code available to copy');
        }
      }
    } catch (error) {
      toast.error('Action failed, please try again');
      console.error('Referral action failed', error);
    }
  };

  return (
    <Card className="border shadow-sm">
      <TooltipProvider>
        <CardContent className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex items-start gap-4">
            <Users className="h-8 w-8" />

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Your referral code
              </p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xl font-semibold tracking-[0.2em] text-foreground">
                  {referralCode}
                </p>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-lg border"
                  onClick={() => handleAction('copy-code')}
                  aria-label="Copy referral code"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:grid-cols-3">
            {actions.map(({ key, icon: Icon, label, color }) => (
              <Tooltip key={key} delayDuration={150}>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className={`h-12 w-12 rounded-2xl border ${color} hover:bg-gray-100`}
                    onClick={() => handleAction(key)}
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      </TooltipProvider>
    </Card>
  );
};

export default ReferralCodeCard;
