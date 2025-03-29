'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BookIcon, HelpCircleIcon, InfoIcon, MailIcon, PlayCircleIcon } from 'lucide-react';

export const helpItems = [
  { label: 'FAQs', icon: BookIcon, url: '/' },
  { label: 'User Tutorials', icon: PlayCircleIcon, url: '/' },
  { label: 'About Us', icon: InfoIcon, url: '/' },
  { label: 'Contact Us', icon: MailIcon, url: '/' },
];

export default function HelpCenter() {
  return (
    <TooltipProvider>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <HelpCircleIcon
            size={18}
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
                <DropdownMenuItem className="flex flex-col items-center justify-center w-10 h-10 rounded-full border transition cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                  <item.icon className="h-6 w-6" />
                </DropdownMenuItem>
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
