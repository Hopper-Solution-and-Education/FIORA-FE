'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ICON_SIZE } from '@/shared/constants/size';
import { NewspaperIcon } from 'lucide-react';
import Link from 'next/link';
import { newsItems } from './utils';

export default function NewsCenter() {
  return (
    <TooltipProvider>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col gap-1 justify-center items-center">
                <NewspaperIcon
                  size={ICON_SIZE.MD}
                  className="transition-all duration-200 hover:scale-110 cursor-pointer"
                />
                <span className="text-sm">News</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>News</p>
            </TooltipContent>
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="p-4 grid grid-cols-5 gap-4 border shadow-md w-[300px]"
        >
          {newsItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Link
                  href={item.url}
                  className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <item.icon size={ICON_SIZE.MD} />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top">
                <span>{item.label}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
