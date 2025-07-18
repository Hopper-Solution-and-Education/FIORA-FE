'use client';

import { MediaTypeEnum, SectionTypeEnum } from '@/features/landing/constants';
import { useAppDispatch } from '@/store';
import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { saveSection } from '../slices';
import { IMedia, ISection } from '../slices/types';

interface UseSectionCardLogicProps {
  sectionData: ISection | undefined;
  control: any;
  sectionType: SectionTypeEnum;
}

const mediaTypeMapping: Record<SectionTypeEnum, MediaTypeEnum> = {
  [SectionTypeEnum.BANNER]: MediaTypeEnum.IMAGE,
  [SectionTypeEnum.KPS]: MediaTypeEnum.IMAGE,
  [SectionTypeEnum.PARTNER_LOGO]: MediaTypeEnum.IMAGE,
  [SectionTypeEnum.VISION_MISSION]: MediaTypeEnum.EMBEDDED,
  [SectionTypeEnum.HEADER]: MediaTypeEnum.IMAGE,
  [SectionTypeEnum.FOOTER]: MediaTypeEnum.IMAGE,
  [SectionTypeEnum.REVIEW]: MediaTypeEnum.IMAGE,
  [SectionTypeEnum.SYSTEM]: MediaTypeEnum.IMAGE,
};

function useSectionCardLogic({ sectionData, control, sectionType }: UseSectionCardLogicProps) {
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

  const addMedia = (type: MediaTypeEnum) => {
    const newMedia: IMedia = {
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
      updatedBy: '',
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

  const handleAddMedia = (sectionType: SectionTypeEnum) => {
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
