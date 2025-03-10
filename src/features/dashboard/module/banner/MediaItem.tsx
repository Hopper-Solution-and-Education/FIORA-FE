'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MediaType } from '@prisma/client';
import { ArrowDown, ArrowUp, Image as ImageIcon, Trash2, Video } from 'lucide-react';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
interface MediaItemProps {
  mediaIndex: number;
  control: any;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function MediaItem({
  mediaIndex,
  control,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: MediaItemProps) {
  const [isOpen, setIsOpen] = useState(true);

  const mediaPath = `medias.${mediaIndex}`;
  const mediaType = control._formValues.medias[mediaIndex].media_type;

  const handleMediaTypeChange = (value: MediaType) => {
    control._formValues.medias[mediaIndex].media_type = value;
  };

  const getMediaPreview = () => {
    const mediaUrl = control._formValues.medias[mediaIndex].media_url;
    const embedCode = control._formValues.medias[mediaIndex].embed_code;

    if (!mediaUrl && !embedCode) {
      return (
        <div className="flex items-center justify-center h-20 bg-gray-100 rounded-md">
          {mediaType === MediaType.IMAGE && <ImageIcon className="h-6 w-6 text-gray-400" />}
          {mediaType === MediaType.VIDEO && <Video className="h-6 w-6 text-gray-400" />}
          {mediaType === MediaType.EMBEDDED && <div className="text-gray-400 text-sm">Embed</div>}
        </div>
      );
    }

    if (mediaType === MediaType.IMAGE && mediaUrl) {
      return (
        <div className="relative h-40 bg-gray-100 rounded-md overflow-hidden">
          <Image
            src={mediaUrl || '/placeholder.svg'}
            alt="Preview"
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg?height=120&width=220';
            }}
          />
        </div>
      );
    }

    if (mediaType === MediaType.VIDEO && mediaUrl) {
      return (
        <div className="relative h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
          <Video className="h-6 w-6 text-gray-400" />
          <span className="text-xs text-gray-500 ml-2">{mediaUrl.split('/').pop()}</span>
        </div>
      );
    }

    if (mediaType === MediaType.EMBEDDED && embedCode) {
      return (
        <div className="relative h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
          <span className="text-xs text-gray-500">Embedded content</span>
        </div>
      );
    }
  };

  return (
    <Card className="border border-gray-200">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-6 w-6 hover:bg-transparent">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{mediaType}</Badge>
              <span className="text-sm font-medium truncate max-w-[200px]">
                {control._formValues.medias[mediaIndex].description || 'Untitled Media'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              disabled={isFirst}
              className="h-7 w-7 p-0"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              disabled={isLast}
              className="h-7 w-7 p-0"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          <CardContent className="p-3 grid grid-cols-3 gap-4">
            <div className="col-span-1">{getMediaPreview()}</div>

            <div className="col-span-2 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`${mediaPath}.media_type`} className="text-xs mb-1 block">
                    Media Type
                  </Label>
                  <Select
                    defaultValue={mediaType}
                    onValueChange={(value) => handleMediaTypeChange(value as MediaType)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MediaType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...control.register(`${mediaPath}.media_type`)}
                    value={mediaType}
                  />
                </div>

                <div>
                  <Label htmlFor={`${mediaPath}.description`} className="text-xs mb-1 block">
                    Description
                  </Label>
                  <Input
                    id={`${mediaPath}.description`}
                    className="h-8"
                    {...control.register(`${mediaPath}.description`)}
                  />
                </div>
              </div>

              {(mediaType === MediaType.IMAGE || mediaType === MediaType.VIDEO) && (
                <div>
                  <Label htmlFor={`${mediaPath}.media_url`} className="text-xs mb-1 block">
                    Media URL
                  </Label>
                  <Input
                    id={`${mediaPath}.media_url`}
                    className="h-8"
                    placeholder="Enter URL or upload file"
                    {...control.register(`${mediaPath}.media_url`)}
                  />
                </div>
              )}

              {mediaType === MediaType.EMBEDDED && (
                <div>
                  <Label htmlFor={`${mediaPath}.embed_code`} className="text-xs mb-1 block">
                    Embed Code
                  </Label>
                  <Textarea
                    id={`${mediaPath}.embed_code`}
                    className="h-20 min-h-[80px]"
                    placeholder="Paste embed code here"
                    {...control.register(`${mediaPath}.embed_code`)}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
