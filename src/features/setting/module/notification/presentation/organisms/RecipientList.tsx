// src/components/recipient-list.tsx
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
      const userNotification = data.userNotifications.find((userNotification) => {
        return userNotification.User.email === recipient;
      });
      return {
        email: recipient,
        createAt: userNotification ? userNotification?.createdAt : data.sendDate,
        isValid: userNotification !== undefined,
        isSelected: recipient === emailSelected,
      };
    });
  }, [data.recipients, data.userNotifications, data.sendDate, emailSelected]);

  const [search, setSearch] = useState('');

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold flex items-center justify-between">
        Recipients{' '}
        <span className="text-gray-500 text-base font-normal">({data.recipients.length})</span>
      </h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search emails..."
          className="pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2">
          {recipientData
            .filter((recipient) => recipient.email.includes(search))
            .map((recipient) => (
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
