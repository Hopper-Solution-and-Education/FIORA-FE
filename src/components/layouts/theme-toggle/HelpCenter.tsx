'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookIcon, HelpCircleIcon, InfoIcon, MailIcon, PlayCircleIcon } from 'lucide-react';

export default function HelpCenter() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {/* <Button variant="ghost" size="icon" className="relative w-10 h-10"> */}
        <HelpCircleIcon
          size={18}
          className="transition-all duration-200 hover:text-primary hover:scale-110 cursor-pointer"
        />
        {/* </Button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="z-50">
        <DropdownMenuItem>
          <BookIcon className="mr-2 h-4 w-4" />
          <span>FAQs</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PlayCircleIcon className="mr-2 h-4 w-4" />
          <span>User Tutorials</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <InfoIcon className="mr-2 h-4 w-4" />
          <span>About Us</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MailIcon className="mr-2 h-4 w-4" />
          <span>Contact Us</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
