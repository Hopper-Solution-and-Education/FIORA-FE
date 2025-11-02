'use client';

import { NavItem } from '@/features/landing/presentation/atoms/NavItem';
import { RouteEnum } from '@/shared/constants/RouteEnum';
import { ICON_SIZE } from '@/shared/constants/size';
import { NewspaperIcon } from 'lucide-react';
import Link from 'next/link';

type NewsCenterProps = {
  showLabel?: boolean;
};

export default function NewsCenter({ showLabel = true }: NewsCenterProps) {
  return (
    <Link href={RouteEnum.News}>
      <NavItem
        label="News"
        tooltip="News"
        showLabel={showLabel}
        icon={
          <NewspaperIcon
            size={ICON_SIZE.MD}
            className="transition-all duration-200 text-foreground group-hover:text-primary group-hover:scale-110"
          />
        }
      />
    </Link>
  );
}
