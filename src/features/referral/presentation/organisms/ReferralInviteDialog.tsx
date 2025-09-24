'use client';
import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
interface ReferralInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (emails: string[]) => Promise<{ createdEmails: string[]; duplicateEmails: string[] }>;
  onCheckExistingEmails?: (emails: string[]) => Promise<string[]>; // Returns list of existing emails
  isSubmitting?: boolean;
}
const extractEmails = (raw: string) => {
  const parts = raw
    .split(/[\s,;\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  return Array.from(new Set(parts.map((email) => email.toLowerCase())));
};
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const findDuplicateEmails = (raw: string) => {
  const parts = raw
    .split(/[\s,;\n]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const email of parts) {
    if (seen.has(email)) {
      duplicates.add(email);
    } else {
      seen.add(email);
    }
  }

  return Array.from(duplicates);
};
const ReferralInviteDialog = ({
  open,
  onOpenChange,
  onInvite,
  onCheckExistingEmails,
  isSubmitting,
}: ReferralInviteDialogProps) => {
  const [value, setValue] = useState('');

  const resetState = useCallback(() => {
    setValue('');
  }, []);

  useEffect(() => {
    if (!open) {
      resetState();
    }
  }, [open, resetState]);

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const rawEmails = value
      .split(/[\s,;\n]+/)
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);

    if (!rawEmails.length) {
      toast.error('Please enter at least one email address.');
      return;
    }

    // Check for duplicate emails in user input
    const duplicates = findDuplicateEmails(value);
    if (duplicates.length > 0) {
      toast.error(
        `Duplicate emails found: ${duplicates.join(', ')}. Please remove duplicates before sending.`,
      );
      return;
    }

    const emails = extractEmails(value);
    const invalid = emails.filter((email) => !isValidEmail(email));
    if (invalid.length) {
      toast.error(`Invalid email format: ${invalid.join(', ')}.`);
      return;
    }

    // Check for existing emails in database
    if (onCheckExistingEmails) {
      try {
        const existingEmails = await onCheckExistingEmails(emails);
        if (existingEmails.length > 0) {
          toast.error(`These emails are already invited: ${existingEmails.join(', ')}.`);
          return;
        }
      } catch {
        toast.error('Failed to validate emails. Please try again.');
        return;
      }
    }

    try {
      const response = await onInvite(emails);

      // Only close dialog if invitations were actually sent (no duplicates in DB)
      if (response.createdEmails.length > 0) {
        toast.success(
          `Successfully sent ${response.createdEmails.length} invitation${response.createdEmails.length === 1 ? '' : 's'}!`,
        );
        setValue('');
        handleClose();
      } else if (response.duplicateEmails.length > 0) {
        toast.error(`These emails are already invited: ${response.duplicateEmails.join(', ')}.`);
      } else {
        toast.error('No valid emails to send invitations to.');
      }
    } catch (err: any) {
      // Only show error if it's a validation error from the dialog
      // API errors will be handled by ReferralUIPage
      const message =
        err?.data?.message || err?.message || 'Failed to send invites. Please try again.';
      toast.error(message);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite friends to Fiora</DialogTitle>
          <DialogDescription>
            Enter one or more email addresses. Separate multiple emails with commas or new lines.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="friend1@example.com, friend2@example.com"
            minLength={3}
            rows={5}
          />

          <DefaultSubmitButton
            isSubmitting={isSubmitting}
            disabled={isSubmitting || !value.trim()}
            onSubmit={() => handleSubmit()}
            onBack={handleClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default ReferralInviteDialog;
