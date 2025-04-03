import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';
import { PluginAPI } from 'tailwindcss/types/config';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  variants: {
    extend: {
      scrollbar: ['responsive'],
    },
  },
  theme: {
    extend: {
      keyframes: {
        hide: {
          from: {
            opacity: '1',
          },
          to: {
            opacity: '0',
          },
        },
        slideDownAndFade: {
          from: {
            opacity: '0',
            transform: 'translateY(-6px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideLeftAndFade: {
          from: {
            opacity: '0',
            transform: 'translateX(6px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        slideUpAndFade: {
          from: {
            opacity: '0',
            transform: 'translateY(6px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideRightAndFade: {
          from: {
            opacity: '0',
            transform: 'translateX(-6px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        marquee: {
          from: {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(calc(-100% - var(--gap)))',
          },
        },
        'marquee-vertical': {
          from: {
            transform: 'translateY(0)',
          },
          to: {
            transform: 'translateY(calc(-100% - var(--gap)))',
          },
        },
      },
      animation: {
        hide: 'hide 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideDownAndFade: 'slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideLeftAndFade: 'slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideUpAndFade: 'slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        slideRightAndFade: 'slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        marquee: 'marquee var(--duration) infinite linear',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'foreground-reverse': 'hsl(var(--foreground-reverse))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontWeight: {
        thin: '100',
        light: '300',
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      fontSize: {
        xxs: '0.625rem',
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
        '5xl': '2.25rem',
        '6xl': '2.5rem',
        '7xl': '3rem',
      },
      lineHeight: {
        line_xxs: '1',
        line_xs: '1.2',
        line_sm: '1.4',
        line_md: '1.6',
        line_lg: '1.8',
        line_xl: '2',
      },
      letterSpacing: {
        tight: '-0.05em',
        normal: '0',
        wide: '0.05em',
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
      },
    },
  },
  plugins: [
    animatePlugin,
    function ({ addUtilities }: PluginAPI) {
      const newUtilities = {
        '.scrollbar-thin': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
        },
        '.scrollbar-none': {
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-track-transparent': {
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
        },
        '.scrollbar-track-muted': {
          '&::-webkit-scrollbar-track': {
            background: 'hsl(var(--muted))',
            borderRadius: '4px',
          },
        },
        '.scrollbar-thumb-muted': {
          '&::-webkit-scrollbar-thumb': {
            background: 'hsl(var(--muted-foreground)/0.3)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'hsl(var(--muted-foreground)/0.5)',
          },
        },
        '.scrollbar-thumb-primary': {
          '&::-webkit-scrollbar-thumb': {
            background: 'hsl(var(--primary)/0.5)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'hsl(var(--primary)/0.7)',
          },
        },
        '.scrollbar-thumb-accent': {
          '&::-webkit-scrollbar-thumb': {
            background: 'hsl(var(--accent)/0.7)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'hsl(var(--accent)/0.9)',
          },
        },
        '.scrollbar-rounded': {
          '&::-webkit-scrollbar-track': {
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '4px',
          },
        },
      };

      addUtilities(newUtilities, {
        respectImportant: true,
        respectPrefix: true,
      });
    },
  ],
} satisfies Config;
