'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-lg',
            pathname === item.href
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
