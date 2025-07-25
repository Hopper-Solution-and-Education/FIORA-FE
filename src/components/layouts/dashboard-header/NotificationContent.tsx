// src/components/notification-dropdown.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // Still useful for the overall structure
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Import DropdownMenu components
import { ScrollArea } from '@/components/ui/scroll-area';
import { ICON_SIZE } from '@/shared/constants/size';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // For View All link

interface Notification {
  id: string;
  isRead: boolean;
  notificationId: string;
  notification: {
    title: string;
    message: string;
    createdAt: string;
    imageUrl: string;
    deepLink: string;
  };
}

export function NotificationContent({ data }: { data: Notification[] }) {
  const unreadCount = data.filter((n) => !n.isRead).length;

  const NotificationItem = ({
    title,
    message,
    createdAt,
    imageUrl,
  }: Notification['notification']) => {
    return (
      <div
        className={cn(
          'flex items-center p-3 gap-4 rounded-lg shadow-sm shadow-gray-400 border border-gray-200',
        )}
      >
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-600">{message}</p>
          <p className="text-xs text-gray-500 mt-1">{format(createdAt, 'dd MMM yyyy')}</p>
        </div>
        {imageUrl && (
          <div className="w-16 h-16 flex-shrink-0 relative overflow-hidden rounded-md border border-gray-200">
            <Image
              src={imageUrl}
              alt="Notification thumbnail"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Bell
            size={ICON_SIZE.MD}
            className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
          />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 md:w-96 p-0" align="end" forceMount>
        <Card className="shadow-none border-0">
          <CardHeader className="flex flex-row items-center justify-end pb-2">
            <Link href="/setting/notification" passHref>
              <Button variant="link" className="text-sm p-0 h-auto">
                View All
              </Button>
            </Link>
          </CardHeader>
          <DropdownMenuSeparator className="m-0" /> {/* Separator below header */}
          <CardContent className="p-0">
            <ScrollArea className="h-[360px] max-h-[400px]">
              <div className="space-y-3 p-4">
                {data.map((notification: Notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    asChild
                    className="p-0 focus:bg-transparent cursor-pointer"
                  >
                    {/* Wrap NotificationItem with Link if it has a link */}
                    {notification?.notification?.deepLink ? (
                      <Link href={notification?.notification?.deepLink} passHref>
                        <NotificationItem {...notification?.notification} />
                      </Link>
                    ) : (
                      <NotificationItem {...notification?.notification} />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
