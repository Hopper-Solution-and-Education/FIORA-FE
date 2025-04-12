'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
import { MediaType, SectionType } from '@prisma/client';
import { ChevronDown, ChevronRight, PlusCircle, Trash2 } from 'lucide-react';
import useSectionCardLogic from '../../hooks/useSectionCardLogic';
import { ISection } from '../../slices/types';
import MediaItem from './MediaItem';

interface SectionCardProps {
  sectionData: ISection | undefined;
  control: any;
  sectionType: SectionType;
}

export default function SectionCard({ sectionData, control, sectionType }: SectionCardProps) {
  const {
    isOpen,
    setIsOpen,
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

  return (
    <Card className="mb-4 border border-gray-200">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <div className="flex items-center space-x-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="ml-2">
                {sectionType === 'KPS' ? 'KSP' : sectionType.replace('_', ' ')}
              </Badge>
              <Badge variant="secondary" className="ml-2">
                {mediaFields.length} media items
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0 px-4 pb-4">
            <div className="mb-4">
              <Label htmlFor="description" className="mb-2 block">
                Description
              </Label>
              <Input
                id="name"
                placeholder="Enter section description"
                {...control.register('name')}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Media Items</h3>
                <div className="flex space-x-2">
                  {(sectionType === SectionType.BANNER ||
                    sectionType === SectionType.KPS ||
                    sectionType === SectionType.PARTNER_LOGO ||
                    sectionType === SectionType.HEADER ||
                    sectionType === SectionType.FOOTER ||
                    sectionType === SectionType.REVIEW ||
                    sectionType === SectionType.SYSTEM) && (
                    <Button variant="outline" size="sm" onClick={() => addMedia(MediaType.IMAGE)}>
                      <PlusCircle className="h-3 w-3 mr-1" /> Image
                    </Button>
                  )}

                  {(sectionType === SectionType.VISION_MISSION ||
                    sectionType === SectionType.REVIEW) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addMedia(MediaType.EMBEDDED)}
                    >
                      <PlusCircle className="h-3 w-3 mr-1" /> Embed
                    </Button>
                  )}
                </div>
              </div>

              {mediaFields.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground mb-2">No media items yet</p>
                  <Button variant="outline" size="sm" onClick={() => handleAddMedia(sectionType)}>
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
        </CollapsibleContent>
      </Collapsible>

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
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemoveMedia}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
