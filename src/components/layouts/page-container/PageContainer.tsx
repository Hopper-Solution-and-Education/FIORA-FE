import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';

export default function PageContainer({
  children,
  scrollable = true,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className="h-[calc(100dvh-52px)]">
          <div className="flex flex-1 md:px-6">{children}</div>
        </ScrollArea>
      ) : (
        <div className="flex flex-1 md:px-6">{children}</div>
      )}
    </>
  );
}
