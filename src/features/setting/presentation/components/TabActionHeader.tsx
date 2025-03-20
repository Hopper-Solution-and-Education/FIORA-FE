'use client';

import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TabActionHeaderProps } from '../types';

export const TabActionHeader = ({
  title,
  description,
  buttonLabel,
  modalComponent: ModalComponent,
}: TabActionHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          variant="default"
          className="flex items-center gap-2"
          size="lg"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="w-7 h-7" />
          {buttonLabel}
        </Button>
      </div>
      <ModalComponent isOpen={isOpen} setIsOpen={setIsOpen} />
      <Separator />
    </div>
  );
};
