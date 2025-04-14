// src/features/home/module/category/components/LucieIcon.tsx
import React from 'react';
import { Icons } from '@/components/Icon';

type IconKeys = keyof typeof Icons;

const LucieIcon = ({ icon, ...props }: { icon: string | undefined; [key: string]: any }) => {
  // Handle case where icon is undefined or not a string
  if (typeof icon !== 'string') {
    return <Icons.logo {...props} />;
  }

  // Only handle system icons here since URL check is in IconDisplay
  const Icon = Icons[icon as IconKeys];
  return Icon ? <Icon {...props} /> : <Icons.logo {...props} />;
};

export default LucieIcon;
