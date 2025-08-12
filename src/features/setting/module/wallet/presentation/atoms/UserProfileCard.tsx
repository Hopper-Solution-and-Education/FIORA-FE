import { Icons } from '@/components/Icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface UserProfileCardProps {
  user?: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  userId: string;
  className?: string;
}

const UserProfileCard = ({ user, userId, className }: UserProfileCardProps) => {
  const [copied, setCopied] = useState<string | null>(null);
  const displayName = user?.name || user?.email || userId;

  const getInitials = () => {
    if (user?.name && user.name.trim().length > 0) {
      return user.name.replace(/\s+/g, '').substring(0, 2).toUpperCase();
    }
    if (user?.email && user.email.trim().length > 0) {
      return user.email.replace(/\s+/g, '').substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'flex items-center gap-2 cursor-pointer transition-all duration-200 hover:opacity-80 group',
              className,
            )}
          >
            <Avatar className="w-8 h-8 ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-200">
              {user?.image ? (
                <AvatarImage src={user.image} alt="avatar" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-600 text-sm font-semibold">
                  {getInitials()}
                </AvatarFallback>
              )}
            </Avatar>
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
                {user?.image ? (
                  <AvatarImage src={user.image} alt="avatar" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold dark:from-blue-800 dark:to-indigo-900">
                    {getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user?.name || 'No name provided'}
                </h3>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    <Icons.user className="w-3 h-3 mr-1.5" />
                    User
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 dark:border-neutral-800">
              {/* User ID */}
              <div className="flex flex-row items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                  User ID
                </span>
                <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                  {userId}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 opacity-100 transition-opacity flex-shrink-0"
                  onClick={() => handleCopy(userId, 'userId')}
                >
                  {copied === 'userId' ? (
                    <Icons.check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Icons.clipboardList className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                  )}
                </Button>
              </div>

              {/* Email */}
              {user?.email && (
                <div className="flex flex-row items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                    Email
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                    {user.email}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => handleCopy(user.email || '', 'email')}
                  >
                    {copied === 'email' ? (
                      <Icons.check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Icons.clipboardList className="w-3 h-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                    )}
                  </Button>
                </div>
              )}

              {user?.name && (
                <div className="flex flex-row items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                    Full Name
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                    {user.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => handleCopy(user.name || '', 'name')}
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

            {/* Footer with action hint */}
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-center">
              <button
                data-test="user-profile-card-view-detail"
                type="button"
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-150 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60"
                tabIndex={-1}
                disabled
                style={{ cursor: 'default' }}
              >
                <Icons.eye className="w-4 h-4" />
                View Detail
              </button>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserProfileCard;
