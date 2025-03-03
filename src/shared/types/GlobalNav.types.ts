import { LucideProps } from 'lucide-react';
import { Icons } from '@/components/Icon';

export interface GlobalNavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: keyof typeof Icons;
  props?: LucideProps;
  label?: string;
  description?: string;
  isActive?: boolean;
}
