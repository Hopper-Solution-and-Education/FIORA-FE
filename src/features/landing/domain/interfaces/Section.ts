import { IMedia } from '@/features/setting/module/landing/slices/types';
import { Section } from '@prisma/client';

export interface ISection extends Omit<Section, 'medias'> {
  medias: IMedia[];
}
