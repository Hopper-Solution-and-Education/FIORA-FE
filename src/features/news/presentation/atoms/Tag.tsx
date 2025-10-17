// components/atoms/Tag.tsx
import { cn } from '@/shared/utils';

interface TagProps {
  children: React.ReactNode;
  className?: string;
}

const Tag = ({ children, className }: TagProps) => (
  <span
    className={cn(
      'inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors',
      className,
    )}
  >
    {children}
  </span>
);

export default Tag;
