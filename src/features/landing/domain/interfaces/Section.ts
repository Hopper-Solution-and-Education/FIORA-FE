import { Media, Section } from '@prisma/client';

export interface ISection extends Section {
  medias: Media[];
}
