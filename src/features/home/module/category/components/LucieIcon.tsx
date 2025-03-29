import React from 'react';
import { Icons } from '@/components/Icon';

type IconKeys = keyof typeof Icons;

const LucieIcon = ({ icon, ...props }: { icon: string | undefined; [key: string]: any }) => {
  const Icon = Icons[icon as IconKeys];
  return Icon ? <Icon {...props} /> : <Icons.logo />;
};

export default LucieIcon;
