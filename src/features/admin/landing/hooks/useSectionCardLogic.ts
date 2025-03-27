'use client';

import { useAppDispatch } from '@/store';
import { Media, MediaType, SectionType } from '@prisma/client';
import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { saveSection } from '../slices';
import { ISection } from '../slices/types';

interface UseSectionCardLogicProps {
  sectionData: ISection | undefined;
  control: any;
  sectionType: SectionType;
}

const mediaTypeMapping: Record<SectionType, MediaType> = {
  [SectionType.BANNER]: MediaType.IMAGE,
  [SectionType.KPS]: MediaType.IMAGE,
  [SectionType.PARTNER_LOGO]: MediaType.IMAGE,
  [SectionType.VISION_MISSION]: MediaType.EMBEDDED,
  [SectionType.HEADER]: MediaType.IMAGE,
  [SectionType.FOOTER]: MediaType.IMAGE,
  [SectionType.REVIEW]: MediaType.IMAGE,
  [SectionType.SYSTEM]: MediaType.IMAGE,
};

function useSectionCardLogic({ sectionData, control, sectionType }: UseSectionCardLogicProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mediaIndexToRemove, setMediaIndexToRemove] = useState<number | null>(null);
  const dispatch = useAppDispatch();

  const {
    fields: mediaFields,
    append: appendMedia,
    remove: removeMedia,
    move: moveMedia,
  } = useFieldArray({
    control,
    name: 'medias',
  });

  const addMedia = (type: MediaType) => {
    const newMedia: Media = {
      id: `${Date.now()}`,
      media_type: type,
      media_url: '',
      redirect_url: '',
      embed_code: '',
      description: '',
      uploaded_by: '',
      uploaded_date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: '',
      updatedBy: null,
      section_id: sectionData?.id ?? '',
    };
    appendMedia(newMedia);

    // const newSection = {
    //   ...sectionData,
    //   medias: [...(sectionData?.medias ?? []), newMedia],
    // } as ISection;

    // dispatch(
    //   saveSection({
    //     section: newSection,
    //     sectionType,
    //   }),
    // );
  };

  const handleAddMedia = (sectionType: SectionType) => {
    const mediaType = mediaTypeMapping[sectionType];
    if (mediaType) {
      addMedia(mediaType);
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

  const handleRemoveMedia = (mediaIndex: number) => {
    setMediaIndexToRemove(mediaIndex);
    setIsDialogOpen(true);
  };

  const confirmRemoveMedia = () => {
    if (mediaIndexToRemove !== null) {
      removeMedia(mediaIndexToRemove);
    }
    setIsDialogOpen(false);
    setMediaIndexToRemove(null);

    const newSection = { ...sectionData };
    if (newSection && newSection.medias) {
      newSection.medias = newSection.medias.filter((_, index) => index !== mediaIndexToRemove);
    }

    dispatch(
      saveSection({
        section: newSection as ISection,
        sectionType,
      }),
    );
  };

  return {
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
  };
}

export default useSectionCardLogic;
