// src/components/recipient-list.tsx
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { RecipientItem } from '../molecules/RecipientItem';

interface Recipient {
  id: number;
  email: string;
  time: string;
  status: 'received' | 'not-received';
  selected?: boolean; // To simulate the blue highlight
}

const recipients: Recipient[] = [
  { id: 1, email: 'huynhthig@gmail.com', time: '09/06/2025, 08:27:30', status: 'received' },
  { id: 2, email: 'nguyenhuyf@gmail.com', time: '09/06/2025, 08:27:00', status: 'received' },
  { id: 3, email: 'dinhvane@gmail.com', time: '09/06/2025, 08:26:30', status: 'received' },
  { id: 4, email: 'daothid@gmail.com', time: '09/06/2025, 08:26:00', status: 'received' },
  { id: 5, email: 'levanc@gmail.com', time: '09/06/2025, 08:25:30', status: 'received' },
  {
    id: 6,
    email: 'nguyenvanana@gmail.com',
    time: '09/06/2025, 08:25:00',
    status: 'received',
    selected: true,
  },
  { id: 7, email: 'huynhthanhb@gmail.com', time: '09/06/2025, 08:24:00', status: 'not-received' },
  // Add more recipients as needed for scrolling
  { id: 8, email: 'anotherone@gmail.com', time: '09/06/2025, 08:23:00', status: 'received' },
  { id: 9, email: 'testemail@gmail.com', time: '09/06/2025, 08:22:00', status: 'not-received' },
  { id: 10, email: 'example@gmail.com', time: '09/06/2025, 08:21:00', status: 'received' },
];

export function RecipientList() {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <h2 className="text-2xl font-semibold flex items-center justify-between">
        Recipients <span className="text-gray-500 text-base font-normal">(12)</span>
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
          {recipients.map((recipient) => (
            <RecipientItem key={recipient.id} recipient={recipient} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
