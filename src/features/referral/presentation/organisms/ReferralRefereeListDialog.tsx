'use client';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ReferralUser } from '../../types';

interface ReferralRefereeListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  referees: ReferralUser[];
  isLoading?: boolean;
  onInviteMore?: () => void;
}

const STATUS_META: Record<ReferralUser['status'], { label: string; badgeClass: string }> = {
  INVITED: { label: 'Sent email', badgeClass: 'bg-blue-100 text-blue-700' },
  REGISTERED: { label: 'Registered', badgeClass: 'bg-emerald-100 text-emerald-700' },
  COMPLETED: { label: 'eKYC Completed', badgeClass: 'bg-purple-100 text-purple-700' },
};

const ReferralRefereeListDialog = ({
  open,
  onOpenChange,
  referees,
  isLoading = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onInviteMore,
}: ReferralRefereeListDialogProps) => {
  const hasReferees = Array.isArray(referees) && referees.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>List of Referees</DialogTitle>
          <DialogDescription>
            The email addresses below have received your referral invitation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="flex items-center justify-between rounded-lg border px-4 py-3"
                >
                  <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                  <div className="h-6 w-24 rounded bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ) : hasReferees ? (
            <ScrollArea className="">
              <div className="space-y-2 pr-2">
                {referees.map((referee) => {
                  const meta = STATUS_META[referee.status];
                  return (
                    <div
                      key={referee.id}
                      className="flex items-center justify-between rounded-lg border bg-card px-4 py-3"
                    >
                      <div className="text-sm font-medium text-foreground">{referee.email}</div>
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold uppercase ${meta.badgeClass}`}
                      >
                        {meta.label}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <div className="rounded-lg border border-dashed px-6 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                You haven&apos;t invited anyone yet. Send your referral link to start building your
                network.
              </p>
            </div>
          )}
        </div>

        {/* <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onInviteMore && (
            <Button
              className="w-full sm:w-auto"
              onClick={() => {
                onOpenChange(false);
                onInviteMore();
              }}
            >
              Invite friends
            </Button>
          )}
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default ReferralRefereeListDialog;
