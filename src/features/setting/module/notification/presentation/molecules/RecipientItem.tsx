// src/components/recipient-item.tsx
import { cn } from '@/lib/utils'; // For utility functions, specifically for conditional classNames
import { CheckCircle2, XCircle } from 'lucide-react';

interface RecipientItemProps {
  recipient: {
    email: string;
    time: string;
    status: 'received' | 'not-received';
    selected?: boolean;
  };
}

export function RecipientItem({ recipient }: RecipientItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors',
        recipient.selected
          ? 'bg-blue-50 border border-blue-200'
          : 'bg-white border border-gray-200',
      )}
    >
      <div>
        <p className={cn('font-medium', recipient.selected ? 'text-blue-800' : 'text-gray-800')}>
          {recipient.email}
        </p>
        <p className={cn('text-sm', recipient.selected ? 'text-blue-600' : 'text-gray-500')}>
          {recipient.time}
        </p>
      </div>
      {recipient.status === 'received' ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
    </div>
  );
}
