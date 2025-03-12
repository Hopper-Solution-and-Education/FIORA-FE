'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MediaType, SectionType } from '@prisma/client';
import { ChevronDown, ChevronRight, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import MediaItem from './MediaItem';
import { useAppDispatch } from '@/store';
import { fetchMediaBySection } from '../../slices/actions/fetchMediaBySection';

interface SectionCardProps {
  control: any;
  sectionType: SectionType;
}

export default function SectionCard({ control, sectionType }: SectionCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  const {
    fields: mediaFields,
    append: appendMedia,
    remove: removeMedia,
    move: moveMedia,
  } = useFieldArray({
    control,
    name: 'medias',
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    handleFetchMedia();
  }, [sectionType]);

  const handleFetchMedia = () => {
    console.log('fetch');

    dispatch(fetchMediaBySection(sectionType));
  };

  const addMedia = (type: MediaType) => {
    appendMedia({
      id: Date.now(),
      media_type: type,
      media_url: '',
      embed_code: '',
      description: '',
      uploaded_by: '',
      uploaded_date: new Date(),
    });
  };

  const handleAddMedia = () => {
    switch (sectionType) {
      case SectionType.BANNER:
        addMedia(MediaType.IMAGE);
        break;
      case SectionType.KPS:
        addMedia(MediaType.IMAGE);
        break;
      case SectionType.PARTNER_LOGO:
        addMedia(MediaType.IMAGE);
        break;
      case SectionType.VISION_MISSION:
        addMedia(MediaType.EMBEDDED);
        break;
      default:
        break;
    }
  };

  const moveMediaUp = (mediaIndex: number) => {
    if (mediaIndex > 0) {
      moveMedia(mediaIndex, mediaIndex - 1);
    }
  };

  const moveMediaDown = (mediaIndex: number) => {
    if (mediaIndex < mediaFields.length - 1) {
      moveMedia(mediaIndex, mediaIndex + 1);
    }
  };

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
                {sectionType.replace('_', ' ')}
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
                id="description"
                placeholder="Enter section description"
                {...control.register('description')}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Media Items</h3>
                <div className="flex space-x-2">
                  {(sectionType === SectionType.BANNER ||
                    sectionType === SectionType.KPS ||
                    sectionType === SectionType.PARTNER_LOGO) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (typeof addMedia === 'function') {
                          addMedia(MediaType.IMAGE);
                        } else {
                          console.error('addMedia is not a function');
                        }
                      }}
                    >
                      <PlusCircle className="h-3 w-3 mr-1" /> Image
                    </Button>
                  )}

                  {sectionType === SectionType.VISION_MISSION && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addMedia(MediaType.EMBEDDED)}
                    >
                      <PlusCircle className="h-3 w-3 mr-1" /> Embed
                    </Button>
                  )}

                  <Button onClick={handleFetchMedia}>
                    <PlusCircle className="h-3 w-3 mr-1" /> Embed
                  </Button>
                  {/* 
                 <Button variant="outline" size="sm" onClick={() => addMedia(MediaType.VIDEO)}>
                   <PlusCircle className="h-3 w-3 mr-1" /> Video
                 </Button> */}
                </div>
              </div>

              {mediaFields.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-md">
                  <p className="text-muted-foreground mb-2">No media items yet</p>
                  <Button variant="outline" size="sm" onClick={handleAddMedia}>
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
                      onDelete={() => removeMedia(mediaIndex)}
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
    </Card>
  );
}
