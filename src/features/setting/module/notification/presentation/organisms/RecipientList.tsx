// src/components/recipient-list.tsx
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { INotificationDetails } from '../../domain/entity';
import { RecipientItem } from '../molecules/RecipientItem';

export function RecipientList({
  data,
  emailSelected,
  setEmailSelected,
}: {
  data: INotificationDetails;
  emailSelected: string;
  setEmailSelected: (email: string) => void;
}) {
  useEffect(() => {
    if (!emailSelected && data.recipients.length > 0) {
      setEmailSelected(data.recipients[0]);
    }
  }, [emailSelected, data.recipients, setEmailSelected]);

  const recipientData = useMemo(() => {
    return data.recipients.map((recipient) => {
      const userNotification = data.userNotifications.find(
        (userNotification) => userNotification.User.email === recipient,
      );
      return {
        email: recipient,
        createAt: userNotification?.createdAt || data.createdAt,
        isValid: userNotification !== undefined,
        isSelected: recipient === emailSelected,
      };
    });
  }, [data.recipients, data.userNotifications, data.createdAt, emailSelected]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-2xl font-semibold flex items-center justify-between">
        Recipients{' '}
        <span className="text-gray-500 text-base font-normal">({data.recipients.length})</span>
      </h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search emails..."
          className="pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <ScrollArea className="flex-1 pr-2">
        {' '}
        {/* Added pr-2 for scrollbar spacing */}
        <div className="space-y-2">
          {recipientData.map((recipient) => (
            <RecipientItem
              key={recipient.email}
              data={recipient}
              onClick={() => setEmailSelected(recipient.email)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
