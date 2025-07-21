'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { MediaTypeEnum, SectionTypeEnum } from '@/features/landing/constants';
import { ArrowDown, ArrowUp, Image as ImageIcon, Trash2, Video } from 'lucide-react';
import Image from 'next/image';
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
  sectionType: SectionTypeEnum;
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
  const {
    watch,
    formState: { errors },
  } = useFormContext();

  const mediaPath = `medias.${mediaIndex}`;
  const mediaType = control._formValues.medias[mediaIndex].media_type;
  const embedCode = watch(`${mediaPath}.embed_code`);

  // Helper to get nested error
  const getNestedError = (errors: any, path: string) => {
    const keys = path.split('.');
    let current = errors;
    for (const key of keys) {
      if (current && current[key]) {
        current = current[key];
      } else return undefined;
    }
    return current;
  };

  const handleMediaTypeChange = (value: MediaTypeEnum) => {
    control._formValues.medias[mediaIndex].media_type = value;
  };

  const getMediaPreview = () => {
    const mediaUrl = control._formValues.medias[mediaIndex].media_url;
    const mediaUrl2 = control._formValues.medias[mediaIndex].media_url_2;
    if (!mediaUrl && !embedCode) {
      return (
        <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-md">
          {mediaType === MediaTypeEnum.IMAGE && <ImageIcon className="h-16 w-16 text-gray-400" />}
          {mediaType === MediaTypeEnum.VIDEO && <Video className="h-6 w-6 text-gray-400" />}
          {mediaType === MediaTypeEnum.EMBEDDED && (
            <div className="text-gray-400 text-center text-sm">Embed</div>
          )}
        </div>
      );
    }

    if (mediaType === MediaTypeEnum.IMAGE) {
      switch (sectionType) {
        case SectionTypeEnum.BANNER:
          return (
            <div className="relative max-h-80 w-full bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
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
        case SectionTypeEnum.KPS:
          return (
            <div className="flex gap-4">
              <div className="relative h-56 w-44 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                {mediaUrl ? (
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
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-md">
                    <ImageIcon className="h-16 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="relative h-56 w-44 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                {mediaUrl2 ? (
                  <Image
                    src={mediaUrl2 || '/placeholder.svg'}
                    alt="Preview"
                    width={400}
                    height={200}
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg?height=200&width=400';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-md">
                    <ImageIcon className="h-16 w-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          );
        case SectionTypeEnum.PARTNER_LOGO:
          return (
            <div className="relative h-48 w-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mx-auto">
              <Image
                src={mediaUrl || '/placeholder.svg'}
                alt="Partner Logo Preview"
                width={600}
                height={400}
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg?height=300&width=300';
                }}
              />
            </div>
          );

        default:
          return (
            <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
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

    if (mediaType === MediaTypeEnum.VIDEO && mediaUrl) {
      return (
        <div className="relative h-20 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden flex items-center justify-center">
          <Video className="h-6 w-6 text-gray-400" />
          <span className="text-xs text-gray-500 ml-2">{mediaUrl.split('/').pop()}</span>
        </div>
      );
    }

    if (mediaType === MediaTypeEnum.EMBEDDED && embedCode) {
      switch (sectionType) {
        case SectionTypeEnum.VISION_MISSION:
          return (
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
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
        case SectionTypeEnum.REVIEW:
          return (
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
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
            <div className="w-full h-20 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md overflow-hidden flex items-center justify-center">
              <span className="text-xs text-gray-500">Embedded content</span>
            </div>
          );
      }
    }
  };

  function renderFieldsDefault() {
    return (
      <>
        <div>
          <Label htmlFor={`${mediaPath}.media_type`} className="text-xs md:text-sm mb-1 block">
            Media Type
          </Label>
          <Select
            disabled
            defaultValue={mediaType}
            onValueChange={(value) => handleMediaTypeChange(value as MediaTypeEnum)}
          >
            <SelectTrigger className="h-8 text-xs md:text-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(MediaTypeEnum).map((type) => (
                <SelectItem key={type} value={type} className="text-xs md:text-sm">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" {...control.register(`${mediaPath}.media_type`)} value={mediaType} />
          {getNestedError(errors, `${mediaPath}.media_type`)?.message && (
            <p className="text-red-500 text-xs mt-1">
              {getNestedError(errors, `${mediaPath}.media_type`)?.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor={`${mediaPath}.description`} className="text-xs md:text-sm mb-1 block">
            Content - Description
          </Label>
          <Textarea
            id={`${mediaPath}.description`}
            className="h-20 text-xs md:text-sm"
            placeholder="Enter description"
            {...control.register(`${mediaPath}.description`)}
          />
          {getNestedError(errors, `${mediaPath}.description`)?.message && (
            <p className="text-red-500 text-xs mt-1">
              {getNestedError(errors, `${mediaPath}.description`)?.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor={`${mediaPath}.redirect_url`} className="text-xs md:text-sm mb-1 block">
            Redirect URL
          </Label>
          <Input
            id={`${mediaPath}.redirect_url`}
            className="h-8 text-xs md:text-sm"
            placeholder="Enter redirect URL (e.g., https://example.com)"
            {...control.register(`${mediaPath}.redirect_url`)}
          />
          {getNestedError(errors, `${mediaPath}.redirect_url`)?.message && (
            <p className="text-red-500 text-xs mt-1">
              {getNestedError(errors, `${mediaPath}.redirect_url`)?.message}
            </p>
          )}
        </div>

        {mediaType === MediaTypeEnum.EMBEDDED && (
          <div>
            <Label htmlFor={`${mediaPath}.embed_code`} className="text-xs md:text-sm mb-1 block">
              Embed Code
            </Label>
            <Textarea
              id={`${mediaPath}.embed_code`}
              className="h-20 min-h-[80px] text-xs md:text-sm"
              placeholder="Paste embed code here"
              {...control.register(`${mediaPath}.embed_code`)}
            />
            {getNestedError(errors, `${mediaPath}.embed_code`)?.message && (
              <p className="text-red-500 text-xs mt-1">
                {getNestedError(errors, `${mediaPath}.embed_code`)?.message}
              </p>
            )}
          </div>
        )}

        {mediaType !== MediaTypeEnum.EMBEDDED && (
          <MediaUploader mediaType={mediaType} mediaPath={mediaPath} sectionType={sectionType} />
        )}
      </>
    );
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs md:text-sm">
              {mediaType}
            </Badge>
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

      <CardContent className="p-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
        <div className="flex items-center justify-center">{getMediaPreview()}</div>
        <div className="space-y-3">{renderFieldsDefault()}</div>
      </CardContent>
    </Card>
  );
}
