'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MediaType, SectionType } from '@prisma/client';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  Trash2,
  Video,
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import MediaUploader from './MediaUploader';

interface MediaItemProps {
  mediaIndex: number;
  control: any;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  sectionType: SectionType;
}

export default function MediaItem({
  mediaIndex,
  control,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  sectionType,
}: MediaItemProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { watch } = useFormContext();

  const mediaPath = `medias.${mediaIndex}`;
  const mediaType = control._formValues.medias[mediaIndex].media_type;
  const embedCode = watch(`${mediaPath}.embed_code`);

  const handleMediaTypeChange = (value: MediaType) => {
    control._formValues.medias[mediaIndex].media_type = value;
  };

  const getMediaPreview = () => {
    const mediaUrl = control._formValues.medias[mediaIndex].media_url;

    if (!mediaUrl && !embedCode) {
      return (
        <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-md">
          {mediaType === MediaType.IMAGE && <ImageIcon className="h-16 w-16 text-gray-400" />}
          {mediaType === MediaType.VIDEO && <Video className="h-6 w-6 text-gray-400" />}
          {mediaType === MediaType.EMBEDDED && (
            <div className="text-gray-400 text-center text-sm">Embed</div>
          )}
        </div>
      );
    }

    if (mediaType === MediaType.IMAGE && mediaUrl) {
      switch (sectionType) {
        case SectionType.BANNER:
          return (
            <div className="relative max-h-80 w-full bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={mediaUrl || '/placeholder.svg'}
                alt="Banner Preview"
                width={800}
                height={200}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg?height=200&width=800';
                }}
              />
            </div>
          );
        case SectionType.KPS:
          return (
            <div className="relative h-48 w-48 bg-gray-100 rounded-md overflow-hidden mx-auto">
              <Image
                src={mediaUrl || '/placeholder.svg'}
                alt="KPS Preview"
                width={300}
                height={300}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg?height=300&width=300';
                }}
              />
            </div>
          );
        case SectionType.PARTNER_LOGO:
          return (
            <div className="relative h-48 w-48 bg-gray-100 rounded-full overflow-hidden mx-auto">
              <Image
                src={mediaUrl || '/placeholder.svg'}
                alt="Partner Logo Preview"
                width={300}
                height={300}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg?height=300&width=300';
                }}
              />
            </div>
          );
        default:
          return (
            <div className="relative h-48 bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={mediaUrl || '/placeholder.svg'}
                alt="Preview"
                width={400}
                height={200}
                className="object-contain w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg?height=200&width=400';
                }}
              />
            </div>
          );
      }
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
      switch (sectionType) {
        case SectionType.VISION_MISSION:
          return (
            <div className="w-full bg-gray-100 rounded-lg shadow-md overflow-hidden p-4">
              <div className="w-full relative" style={{ paddingBottom: '56.25%' /* 16:9 ratio */ }}>
                <div
                  className="absolute inset-0 w-full h-full rounded-md"
                  dangerouslySetInnerHTML={{
                    __html: `<style>iframe { width: 100% !important; height: 100% !important; border: none; border-radius: 8px; }</style>${embedCode}`,
                  }}
                />
              </div>
            </div>
          );
        case SectionType.REVIEW:
          return (
            <div className="w-full bg-gray-100 rounded-lg shadow-md overflow-hidden p-4">
              <div className="w-full relative" style={{ paddingBottom: '56.25%' /* 16:9 ratio */ }}>
                <div
                  className="absolute inset-0 w-full h-full rounded-md"
                  dangerouslySetInnerHTML={{
                    __html: `<style>iframe { width: 100% !important; height: 100% !important; border: none; border-radius: 8px; }</style>${embedCode}`,
                  }}
                />
              </div>
            </div>
          );

        default:
          return (
            <div className="w-full h-20 bg-gray-100 rounded-lg shadow-md overflow-hidden flex items-center justify-center p-4">
              <span className="text-xs text-gray-500">Embedded content</span>
            </div>
          );
      }
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
          <CardContent className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Side: Media Preview (50%) */}
            <div className="flex items-center justify-center">{getMediaPreview()}</div>

            {/* Right Side: Fields (50%) */}
            <div className="space-y-3">
              <div>
                <Label htmlFor={`${mediaPath}.media_type`} className="text-xs mb-1 block">
                  Media Type
                </Label>
                <Select
                  disabled
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
                  placeholder="Enter description"
                  {...control.register(`${mediaPath}.description`)}
                />
              </div>

              <div>
                <Label htmlFor={`${mediaPath}.redirect_url`} className="text-xs mb-1 block">
                  Redirect URL
                </Label>
                <Input
                  id={`${mediaPath}.redirect_url`}
                  className="h-8"
                  placeholder="Enter redirect URL (e.g., https://example.com)"
                  {...control.register(`${mediaPath}.redirect_url`)}
                />
              </div>

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

              {mediaType !== MediaType.EMBEDDED && (
                <MediaUploader mediaType={mediaType} mediaPath={mediaPath} />
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
