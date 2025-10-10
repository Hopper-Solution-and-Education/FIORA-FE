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
import { helpItems } from './utils';

type HelpCenterProps = {
  isShowingText?: boolean;
};

export default function HelpCenter({ isShowingText = true }: HelpCenterProps) {
  return (
    <DropdownMenu modal={false}>
      <CommonTooltip content="Helps">
        <DropdownMenuTrigger asChild>
          <div className="flex flex-col gap-1 justify-center items-center">
            <HelpCircleIcon
              size={ICON_SIZE.MD}
              className="transition-all duration-200 hover:scale-110 cursor-pointer"
            />
            {isShowingText && <span className="text-sm">Helps</span>}
          </div>
        </DropdownMenuTrigger>
      </CommonTooltip>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="p-4 grid grid-cols-5 gap-4 border shadow-md w-[300px]"
      >
        {helpItems.map((item, index) => (
          <CommonTooltip content={item.label} key={index}>
            <Link
              href={item.url}
              className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <item.icon size={ICON_SIZE.MD} />
            </Link>
          </CommonTooltip>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
