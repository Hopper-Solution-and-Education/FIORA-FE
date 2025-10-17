'use client';

import { Icons } from '@/components/Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';
import { useRef, useState } from 'react';
import { EkycResponse } from '../../slices/type';
interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  ekyc?: EkycResponse;
  showTooltip?: boolean;
}

export function UserAvatar({
  src,
  name,
  email,
  size = 'md',
  className,
  ekyc,
  showTooltip = false,
}: UserAvatarProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const displayName = email || name || 'No name';

  const getInitials = () => {
    if (name && name.trim().length > 0) {
      return name.replace(/\s+/g, '').substring(0, 2).toUpperCase();
    }
    if (email && email.trim().length > 0) {
      return email.replace(/\s+/g, '').substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const fallbackSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      await navigator.clipboard.writeText(text);
      setCopied(type);

      timeoutRef.current = setTimeout(() => {
        setCopied(null);
        timeoutRef.current = null;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const avatarComponent = (
    <Avatar
      className={cn(
        sizeClasses[size],
        className,
        showTooltip && 'ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-200',
      )}
    >
      <AvatarImage src={src || undefined} alt={name || email || 'User'} />
      <AvatarFallback
        className={cn(
          showTooltip
            ? 'bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-600 font-semibold'
            : 'bg-primary/10 text-primary font-medium',
          fallbackSizeClasses[size],
        )}
      >
        {getInitials()}
      </AvatarFallback>
    </Avatar>
  );

  if (!showTooltip) {
    return avatarComponent;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-2 cursor-pointer transition-all duration-200 hover:opacity-80 group',
            )}
          >
            {avatarComponent}
            <span className="truncate text-sm font-medium group-hover:text-blue-600 group-hover:dark:text-blue-400 transition-colors duration-200">
              {displayName}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="w-96 p-0 shadow-2xl bg-white dark:bg-neutral-900/95 backdrop-blur-sm border border-gray-100 dark:border-neutral-800"
        >
          <div className="p-6 rounded-xl">
            <div className="flex items-start gap-4 mb-5">
              <Avatar className="w-16 h-16 ring-4 ring-white dark:ring-neutral-800 shadow-lg">
                <AvatarImage src={src || undefined} alt={name || email || 'User'} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold dark:from-blue-800 dark:to-indigo-900">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {ekyc?.User?.name || 'No name provided'}
                </h3>
                <div className="mt-2 ">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 
                    ${(ekyc?.User?.role === 'Admin' && 'bg-red-100 text-red-800') || (ekyc?.User?.role === 'CS' && 'bg-green-100 text-green-800') || (ekyc?.User?.role === 'User' && 'bg-blue-100 text-blue-800') || 'bg-gray-100 text-gray-800'}`}
                  >
                    <Icons.user className={`w-3 h-3 mr-1.5 `} />
                    {ekyc?.User?.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-neutral-800">
              {/* Email */}
              {ekyc?.User?.email && (
                <div className="flex flex-row items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                    Email
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                    {ekyc?.User?.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => handleCopy(ekyc?.User?.email, 'email')}
                  >
                    {copied === 'email' ? (
                      <Icons.check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Icons.clipboardList className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                    )}
                  </Button>
                </div>
              )}

              {/* Name */}
              {ekyc?.User?.name && (
                <div className="flex flex-row items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                    Full Name
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                    {ekyc?.User?.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => handleCopy(ekyc?.User?.name || '', 'name')}
                  >
                    {copied === 'name' ? (
                      <Icons.check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Icons.clipboardList className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default UserAvatar;
