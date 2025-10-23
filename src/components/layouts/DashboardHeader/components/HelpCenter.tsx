'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ICON_SIZE } from '@/shared/constants/size';
import { HelpCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { helpItems } from '../utils';

type HelpCenterProps = {
  isShowingText?: boolean;
};

export default function HelpCenter({ isShowingText = true }: HelpCenterProps) {
  return (
    <DropdownMenu modal={false}>
      <CommonTooltip content="Helps">
        <DropdownMenuTrigger asChild>
          <div className="flex flex-col gap-1 justify-center items-center group">
            <div className="p-2 rounded-lg transition-all duration-200 hover:bg-primary/10 dark:hover:bg-primary/20">
              <HelpCircleIcon
                size={ICON_SIZE.MD}
                className="transition-all duration-200 text-foreground group-hover:text-primary group-hover:scale-110 cursor-pointer"
              />
            </div>
            {isShowingText && (
              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                Helps
              </span>
            )}
          </div>
        </DropdownMenuTrigger>
      </CommonTooltip>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="p-4 grid grid-cols-5 gap-4 border-border/50 shadow-lg w-[300px] bg-background/95 backdrop-blur-sm"
      >
        {helpItems.map((item, index) => (
          <CommonTooltip content={item.label} key={index}>
            <Link
              href={item.url}
              className="flex flex-col items-center justify-center w-10 h-10 rounded-full border border-border/60 transition-all duration-200 cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20 hover:border-primary/50 hover:scale-105"
            >
              <item.icon
                size={ICON_SIZE.MD}
                className="text-foreground hover:text-primary transition-colors"
              />
            </Link>
          </CommonTooltip>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
