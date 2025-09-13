import { tv } from 'tailwind-variants';

export const commonEditorStyles = {
  wrapper: tv({
    base: 'w-full h-full',
  }),

  content: tv({
    base: 'overflow-auto',
    variants: {
      height: {
        mobile: 'h-[150px]',
        tablet: 'h-[180px]',
        smallLaptop: 'h-[200px]',
        laptop: 'h-[220px]',
        desktop: 'h-[230px]',
        small: 'h-[250px]',
        medium: 'h-[270px]',
        large: 'h-[290px]',
        full: 'h-full',
        custom: '',
      },
    },
    defaultVariants: {
      height: 'desktop',
    },
  }),
};
