'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TabActionHeaderProps } from '../types';

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
          className="flex items-center gap-2"
          size="default"
          onClick={() => router.push(redirectPath)}
        >
          <Plus className="w-7 h-7" />
          {buttonLabel}
        </Button>
      </div>
      <Separator />
    </div>
  );
};
