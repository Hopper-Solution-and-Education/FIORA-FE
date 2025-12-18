'use client';

import { useBreadcrumbs } from '@/shared/hooks/useBreadcrumbs';
import { Slash } from 'lucide-react';
import { Session, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import WalletAction from './common/organisms/WalletAction';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';

export function Breadcrumbs({ showWalletAction = true }: { showWalletAction?: boolean }) {
  const { status } = useSession() as { data: Session | null; status: string };
  const items = useBreadcrumbs();
  const pathName = usePathname();
  if (items && items.length === 0) return null;

  const isHiddenWalletAction = pathName?.includes('/wallet') || status === 'unauthenticated';

  const renderWalletAction = () => {
    if (isHiddenWalletAction || !showWalletAction) return null;

    return (
      <WalletAction
        enableDeposit={!isHiddenWalletAction}
        enableTransfer={!isHiddenWalletAction}
        enableWithdraw={!isHiddenWalletAction}
      />
    );
  };

  return (
    <div className="flex justify-between items-center w-full">
      <Breadcrumb>
        <BreadcrumbList>
          {items &&
            items.map((item, index) => (
              <Fragment key={item.title}>
                {index !== items.length - 1 && (
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
                  </BreadcrumbItem>
                )}
                {index < items.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block">
                    <Slash />
                  </BreadcrumbSeparator>
                )}
                {index === items.length - 1 && <BreadcrumbPage>{item.title}</BreadcrumbPage>}
              </Fragment>
            ))}
        </BreadcrumbList>
      </Breadcrumb>

      {renderWalletAction()}
    </div>
  );
}
