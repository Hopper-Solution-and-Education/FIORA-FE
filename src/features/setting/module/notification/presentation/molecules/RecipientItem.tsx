import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CheckCircle2, XCircle } from 'lucide-react';

interface RecipientItemProps {
  data: {
    email: string;
    createAt: string;
    isValid: boolean;
    isSelected: boolean;
  };
  onClick: () => void;
}

export function RecipientItem({ data, onClick }: RecipientItemProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-gray-50 transition-colors',
        data.isSelected ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200',
      )}
      onClick={onClick}
    >
      <div>
        <p
          className={cn('font-medium text-sm', data.isSelected ? 'text-blue-800' : 'text-gray-800')}
        >
          {data.email}
        </p>
        <p className={cn('text-sm', data.isSelected ? 'text-blue-600' : 'text-gray-500')}>
          {format(data.createAt, 'dd/MM/yyyy HH:mm:ss')}
        </p>
      </div>
      {data.isValid ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
    </div>
  );
}
