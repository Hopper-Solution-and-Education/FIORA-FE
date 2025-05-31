import type { HTMLAttributes } from 'react';

export interface IconProps {
  color?: string;
  width?: number | string;
  height?: number | string;
  fill?: string;
  className?: HTMLAttributes<HTMLOrSVGElement>['className'];
  viewBox?: string;
}

export { default as ImgEmpty } from './empty';
