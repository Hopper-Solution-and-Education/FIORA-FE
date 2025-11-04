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
import { NavItem } from '@/features/landing/presentation/atoms/NavItem';
import { ICON_SIZE } from '@/shared/constants/size';
import useMarkNotificationAsRead from '@/shared/hooks/useMarkNotificationAsRead';
import { cn } from '@/shared/utils';
import { format } from 'date-fns';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'; // For View All link
import { useCallback } from 'react';

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

export function NotificationContent({
  data,
  onNotificationUpdate,
}: {
  data: Notification[];
  onNotificationUpdate?: () => void;
}) {
  const unreadCount = data.filter((n) => !n.isRead).length;
  const { markAsRead } = useMarkNotificationAsRead();

  const handleNotificationClick = useCallback(
    async (notification: Notification) => {
      // If notification is unread, mark it as read
      if (!notification.isRead) {
        try {
          await markAsRead(notification.id);
          // Call the callback to refresh the notification list
          onNotificationUpdate?.();
        } catch (error) {
          // Error is already handled in the hook
          console.error('Failed to mark notification as read:', error);
        }
      }
    },
    [markAsRead, onNotificationUpdate],
  );

  const NotificationItem = ({
    isRead,
    data,
    onClick,
  }: {
    isRead: boolean;
    data: Notification['notification'];
    onClick?: () => void;
  }) => {
    return (
      <div
        className={cn(
          'flex items-center p-3 gap-4 rounded-lg border border-border/60 transition-all duration-200 cursor-pointer hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/50 hover:shadow-md',
          isRead && 'opacity-60',
        )}
        onClick={onClick}
      >
        <div className="flex-1">
          <p className="font-semibold text-foreground">{data.title}</p>
          <p className="text-sm text-foreground/80">{data.message}</p>
          <p className="text-xs text-foreground/60 mt-1">{format(data.createdAt, 'dd MMM yyyy')}</p>
        </div>
        {data.imageUrl && (
          <div className="w-16 h-16 flex-shrink-0 relative overflow-hidden rounded-md border border-border/60">
            <Image
              src={data.imageUrl}
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
          <NavItem
            label="Notifications"
            icon={
              <>
                <Bell
                  size={ICON_SIZE.MD}
                  className="transition-all duration-200 text-foreground group-hover:text-primary group-hover:scale-110"
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </>
            }
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 md:w-96 p-0 border-border/50 shadow-lg bg-background/95 backdrop-blur-sm"
        align="end"
        forceMount
      >
        <Card className="shadow-none border-0">
          <CardHeader className="flex flex-row items-center justify-end pb-2">
            <Link href="/notification" passHref>
              <Button variant="link" className="text-sm p-0 h-auto">
                View All
              </Button>
            </Link>
          </CardHeader>
          <DropdownMenuSeparator className="m-0" />
          <CardContent className="p-0">
            <div className="max-h-[400px] overflow-y-auto">
              <div className="space-y-3 p-4">
                {data.map((notification: Notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    asChild
                    className="p-0 focus:bg-transparent cursor-pointer"
                  >
                    {notification?.notification?.deepLink ? (
                      <Link href={notification?.notification?.deepLink} target="_blank">
                        <div onClick={() => handleNotificationClick(notification)}>
                          <NotificationItem
                            isRead={notification.isRead}
                            data={notification?.notification}
                          />
                        </div>
                      </Link>
                    ) : (
                      <NotificationItem
                        isRead={notification.isRead}
                        data={notification?.notification}
                        onClick={() => handleNotificationClick(notification)}
                      />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
