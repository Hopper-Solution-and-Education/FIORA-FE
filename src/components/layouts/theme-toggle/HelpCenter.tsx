'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HelpCircle } from 'lucide-react';

export default function HelpCenter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative w-10 h-10">
          <HelpCircle size={64} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="z-50">
        <DropdownMenuItem>Help Center</DropdownMenuItem>
        <DropdownMenuItem>Contact Support</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
