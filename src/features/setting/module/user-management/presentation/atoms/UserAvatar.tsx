'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  email?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function UserAvatar({ src, name, email, size = 'md', className }: UserAvatarProps) {
  const getInitials = () => {
    if (name && name.length > 0) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }

    if (email && email.length > 0) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarImage src={src || undefined} alt={name || email || 'User'} />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {getInitials()}
        </AvatarFallback>
    </Avatar>
  );
}

export default UserAvatar;
