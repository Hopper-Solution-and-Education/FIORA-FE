'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ICON_SIZE } from '@/shared/constants/size';
import { HelpCircleIcon } from 'lucide-react';
import { helpItems } from './utils';

export default function HelpCenter() {
  return (
    <TooltipProvider>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <HelpCircleIcon
            size={ICON_SIZE.MD}
            className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="p-4 grid grid-cols-4 gap-4 border shadow-md w-[250px]"
        >
          {helpItems.map((item, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                  <item.icon size={ICON_SIZE.MD} />
                </div>
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
