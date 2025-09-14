'use client';

import { Icons } from '@/components/Icon';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEmailModal } from '@/features/email-template/hooks/useEmailModal';
import { Search } from 'lucide-react';
import { EMAIL_TEMPLATES } from '../../constants';

export default function TemplatesSidebar() {
  const { handleOpenModal, selectedTemplate } = useEmailModal();

  return (
    <div className="flex flex-col gap-4 min-w-80 max-h-[calc(100vh-2rem)] p-4">
      {/* Header */}
      <div className="h-12 content-center bg-background z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-medium flex items-center gap-2 text-foreground">
            <Icons.mail className="h-4 w-4" />
            Templates (8)
          </h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Icons.send className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send email</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Search */}
      <div className="h-12 bg-background z-10">
        <div className="relative h-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            className="pl-10 h-full bg-muted text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        {EMAIL_TEMPLATES.map((template) => (
          <Card
            key={template.id}
            className="p-3 cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <CardContent className="p-0 h-16">
              <div className="h-full flex gap-2 items-center justify-between">
                <div className="flex-1">
                  <div className="flex flex-col gap-2">
                    <h4 className="font-medium text-sm text-foreground">{template.name}</h4>
                    {template.type && (
                      <Badge
                        variant="outline"
                        className="w-fit bg-green-500 text-white border-none dark:bg-green-600"
                      >
                        {template.type}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Popover menu */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Icons.ellipsisVertical className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="left"
                    className="w-fit p-0 bg-popover text-popover-foreground"
                  >
                    <div className="self-stretch p-2 inline-flex flex-col justify-start items-start">
                      <div className="self-stretch px-2 py-1.5 inline-flex justify-start items-center gap-4 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer">
                        <p className="flex-1 text-sm font-medium">Set as Default</p>
                        <Icons.mailCheck className="h-4 w-4" />
                      </div>

                      <div className="self-stretch h-px bg-border my-1" />

                      <div className="self-stretch px-2 py-1.5 inline-flex justify-start items-center gap-4 hover:bg-accent hover:text-accent-foreground rounded-sm cursor-pointer">
                        <p className="flex-1 text-sm font-medium">Delete</p>
                        <Icons.trash className="h-4 w-4" />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
