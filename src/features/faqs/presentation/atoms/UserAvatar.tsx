import Image from 'next/image';
import React from 'react';

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, name, alt, size = 'md', className = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-6 w-6 text-xs';
      case 'md':
        return 'h-9 w-9 text-sm';
      case 'lg':
        return 'h-12 w-12 text-base';
    }
  };

  const getFallbackText = () => {
    if (name) {
      return name.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const sizeClasses = getSizeClasses();

  if (src) {
    return (
      <div className={`relative ${sizeClasses} rounded-full overflow-hidden ${className}`}>
        <Image src={src} alt={alt || name || 'User Avatar'} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-700 font-medium transition-transform group-hover:scale-110 ${className}`}
    >
      <span>{getFallbackText()}</span>
    </div>
  );
};

export default UserAvatar;
