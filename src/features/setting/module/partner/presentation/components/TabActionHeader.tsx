'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TabActionHeaderProps } from '../../../../presentation/types';

export const TabActionHeader = ({
  title,
  description,
  buttonLabel,
  redirectPath,
}: TabActionHeaderProps) => {
  const router = useRouter();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button
          variant="default"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          size="icon"
          onClick={() => router.push(redirectPath)}
        >
          {/* <div className="bg-blue-600 rounded-full p-1 flex items-center justify-center"> */}
          <Plus className="w-4 h-4" />
          {/* </div> */}
          {buttonLabel}
        </Button>
      </div>

      <Separator />
    </div>
  );
};
