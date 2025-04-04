import React from 'react';
import { Icons } from '@/components/Icon';
import Image from 'next/image';

type IconKeys = keyof typeof Icons;

const LucieIcon = ({ icon, ...props }: { icon: string | undefined; [key: string]: any }) => {
  // Handle case where icon is undefined or not a string
  if (typeof icon !== 'string') {
    return <Icons.logo {...props} />;
  }

  // Check if the icon is a URL
  if (icon.startsWith('http') || icon.startsWith('https') || icon.startsWith('data:')) {
    console.log(icon);
    return (
      <Image
        src={icon}
        alt="icon"
        width={16} // Default width, can be overridden by props
        height={16} // Default height, can be overridden by props
        {...props}
      />
    );
  }

  // Treat the icon as a system icon name
  const Icon = Icons[icon as IconKeys];
  return Icon ? <Icon {...props} /> : <Icons.logo {...props} />;
};

export default LucieIcon;
