'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MediaTypeEnum, SectionTypeEnum } from '@/features/landing/constants';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import useSectionCardLogic from '../../hooks/useSectionCardLogic';
import { ISection } from '../../slices/types';
import MediaItem from './MediaForm';

interface SectionCardProps {
  sectionData: ISection | undefined;
  control: any;
  sectionType: SectionTypeEnum;
}

export default function SectionCard({ sectionData, control, sectionType }: SectionCardProps) {
  const {
    isDialogOpen,
    setIsDialogOpen,
    mediaFields,
    handleAddMedia,
    handleRemoveMedia,
    confirmRemoveMedia,
    moveMediaUp,
    moveMediaDown,
    addMedia,
  } = useSectionCardLogic({ sectionData, control, sectionType });

  const getSectionHeaderName = useMemo(() => {
    let name = '';
    switch (sectionType) {
      case SectionTypeEnum.BANNER:
        name = 'Banner';
        break;
      case SectionTypeEnum.KPS:
        name = 'KSP';
        break;
      case SectionTypeEnum.PARTNER_LOGO:
        name = 'Partner Logo';
        break;
      case SectionTypeEnum.FOOTER:
        name = 'Footer';
        break;
      case SectionTypeEnum.REVIEW:
        name = 'Review';
        break;
      case SectionTypeEnum.SYSTEM:
        name = 'System';
        break;
      case SectionTypeEnum.VISION_MISSION:
        name = 'Vision Mission';
        break;
      case SectionTypeEnum.HEADER:
        name = 'Header';
        break;
      default:
        break;
    }
    return name;
  }, [sectionType]);

  return (
    <Card className="mb-4 p-4">
      <CardHeader className="flex flex-row items-center justify-between py-2 md:py-3 px-2 md:px-4">
        <div className="flex items-center justify-between w-full mb-4">
          <CardTitle className="text-base md:text-lg lg:text-xl font-bold">
            {getSectionHeaderName}
          </CardTitle>
          <Badge
            variant="secondary"
            className="ml-2 bg-green-50 dark:bg-gray-900 dark:text-gray-100 text-xs md:text-sm"
          >
            {mediaFields.length} media items
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0 px-2 md:px-4 pb-4">
        <div className="mb-4">
          <Label htmlFor="description" className="mb-2 block text-sm md:text-base">
            {sectionType === SectionTypeEnum.FOOTER ? 'Copyright Text' : 'Title'}
          </Label>
          {sectionType === SectionTypeEnum.FOOTER ? (
            <Textarea
              id="description"
              placeholder="Enter copyright text"
              className="text-xs md:text-sm lg:text-base"
              rows={4}
              {...control.register('name')}
            />
          ) : (
            <Input
              id="name"
              placeholder="Enter section title"
              className="text-xs md:text-sm lg:text-base"
              {...control.register('name')}
            />
          )}
        </div>

        <div className="space-y-2">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-2 md:gap-0">
            <h3 className="text-xs md:text-sm font-medium">Media Items</h3>
            <div className="flex space-x-2">
              {/* Show Image Media Add Button if section type is Banner, KPS, Partner Logo, Footer, Review, System */}
              {(sectionType === SectionTypeEnum.BANNER ||
                sectionType === SectionTypeEnum.KPS ||
                sectionType === SectionTypeEnum.PARTNER_LOGO ||
                sectionType === SectionTypeEnum.FOOTER ||
                sectionType === SectionTypeEnum.REVIEW ||
                sectionType === SectionTypeEnum.SYSTEM) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm"
                  data-test={sectionType + '-ADD-IMAGE-BUTTON'}
                  onClick={() => addMedia(MediaTypeEnum.IMAGE)}
                >
                  <PlusCircle className="h-3 w-3 mr-1" /> Image
                </Button>
              )}

              {/* Show Image Media Add Button if section type is Header and no media items */}
              {sectionType === SectionTypeEnum.HEADER && mediaFields.length === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm"
                  data-test={sectionType + '-ADD-IMAGE-BUTTON'}
                  onClick={() => addMedia(MediaTypeEnum.IMAGE)}
                >
                  <PlusCircle className="h-3 w-3 mr-1" /> Image
                </Button>
              )}

              {/* Show Embed Media Add Button if section type is Review */}
              {sectionType === SectionTypeEnum.REVIEW && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm"
                  data-test={sectionType + '-ADD-EMBED-BUTTON'}
                  onClick={() => addMedia(MediaTypeEnum.EMBEDDED)}
                >
                  <PlusCircle className="h-3 w-3 mr-1" /> Embed
                </Button>
              )}

              {/* Show Embed Media Add Button if section type is Vision Mission and no media items */}
              {sectionType === SectionTypeEnum.VISION_MISSION && mediaFields.length === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm"
                  data-test={sectionType + '-ADD-EMBED-BUTTON'}
                  onClick={() => addMedia(MediaTypeEnum.EMBEDDED)}
                >
                  <PlusCircle className="h-3 w-3 mr-1" /> Embed
                </Button>
              )}
            </div>
          </div>

          {mediaFields.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-xs md:text-sm text-muted-foreground mb-2">No media items yet</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs md:text-sm"
                data-test={sectionType + '-ADD-MEDIA-BUTTON'}
                onClick={() => handleAddMedia(sectionType)}
              >
                <PlusCircle className="h-4 w-4" /> Add Media
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {mediaFields.map((media, mediaIndex) => (
                <MediaItem
                  key={media.id}
                  mediaIndex={mediaIndex}
                  control={control}
                  onDelete={() => handleRemoveMedia(mediaIndex)}
                  onMoveUp={() => moveMediaUp(mediaIndex)}
                  onMoveDown={() => moveMediaDown(mediaIndex)}
                  isFirst={mediaIndex === 0}
                  isLast={mediaIndex === mediaFields.length - 1}
                  sectionType={sectionType}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this media item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              data-test="DIALOG-CANCEL-BUTTON"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              data-test="DIALOG-DELETE-BUTTON"
              onClick={confirmRemoveMedia}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
