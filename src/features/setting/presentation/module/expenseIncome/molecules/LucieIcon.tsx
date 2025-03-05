import { LucideProps } from 'lucide-react';
import React from 'react';
import { Icons } from '@/components/Icon';

type IconKeys = keyof typeof Icons;

const LucieIcon = ({ iconName, props }: { iconName: string | undefined; props?: LucideProps }) => {
  const Icon = Icons[iconName as IconKeys];
  return Icon ? <Icon {...props} /> : <Icons.logo />;
};

export default LucieIcon;
