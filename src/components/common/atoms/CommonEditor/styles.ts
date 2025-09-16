import { tv } from 'tailwind-variants';

export const commonEditorStyles = {
  wrapper: tv({
    base: 'w-full h-full',
  }),

  content: tv({
    base: 'overflow-auto',
    variants: {
      height: {
        mobile: 'h-[150px]', // <640px
        tablet: 'h-[180px]', // 640–767px
        smallLaptop: 'h-[220px]', // 768–1023px
        mediumLaptop: 'h-[300px]', // 1024–1439px
        largeLaptop: 'h-[450px]', // 1440–1919px
        extraLarge: 'h-[700px]', // >=1920px
        small: 'h-[150px]', // manual override
        medium: 'h-[300px]',
        large: 'h-[600px]',
        full: 'h-full',
        custom: '',
      },
    },
    defaultVariants: {
      height: 'mediumLaptop',
    },
  }),
};
