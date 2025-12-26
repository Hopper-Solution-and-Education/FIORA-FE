import { ReactNode } from 'react';

export interface Step4Config {
  icon?: ReactNode | null;
  selector: string;
  title?: string;
  content?: ReactNode;
  side?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'left-top'
    | 'right-top'
    | 'left-bottom'
    | 'right-bottom';
  showControls?: boolean;
  pointerPadding?: number;
  pointerRadius?: number;
  nextRoute?: string;
  prevRoute?: string;
}

export interface Step {
  icon: ReactNode | null;
  selector: string;
  title: string;
  content: ReactNode;
  side?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'left-top'
    | 'right-top'
    | 'left-bottom'
    | 'right-bottom';
  showControls?: boolean;
  pointerPadding?: number;
  pointerRadius?: number;
  nextRoute?: string;
  prevRoute?: string;
}

export interface Tour {
  tour: string;
  steps: Step[];
}
