'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavItem } from '@/features/landing/presentation/atoms/NavItem';
import { ICON_SIZE } from '@/shared/constants';
import { HelpCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { helpItems } from '../utils';

export default function HelpCenter() {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild data-test="help-icon">
        <div>
          <NavItem
            label="Helps"
            icon={
              <HelpCircleIcon
                size={ICON_SIZE.MD}
                className="transition-all duration-200 text-foreground group-hover:text-primary group-hover:scale-110"
              />
            }
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="p-4 grid grid-cols-5 gap-4 border-border/50 shadow-lg w-[300px] bg-background/95 backdrop-blur-sm"
        data-test="help-dropdown"
      >
        {helpItems.map((item, index) => (
          <Link
            href={item.url}
            data-test={`help-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            key={index}
          >
            <NavItem
              label={item.shortLabel || item.label}
              className="text-center"
              tooltip={item.label}
              icon={
                <item.icon
                  size={ICON_SIZE.MD}
                  className="text-foreground hover:text-primary transition-colors"
                />
              }
            />
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
