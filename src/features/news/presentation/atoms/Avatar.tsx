'use client';
import { cn } from '@/shared/utils';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

interface AvatarProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  src: string;
  alt: string;
  fallback: string;
}

const Avatar = ({ className, src, alt, fallback, ...props }: AvatarProps) => (
  <AvatarPrimitive.Root
    className={cn('relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  >
    <AvatarPrimitive.Image
      src={src}
      alt={alt}
      className="aspect-square h-full w-full object-cover"
    />
    <AvatarPrimitive.Fallback
      delayMs={600}
      className="flex h-full w-full items-center justify-center rounded-full bg-slate-200 text-slate-500"
    >
      {fallback}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
);

export default Avatar;
