'use client';
import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
export type DeviceType =
  | 'mobile'
  | 'tablet'
  | 'smallLaptop'
  | 'mediumLaptop'
  | 'largeLaptop'
  | 'extraLarge';

interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isSmallLaptop: boolean;
  isMediumLaptop: boolean;
  isLargeLaptop: boolean;
  isExtraLarge: boolean;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

const getDeviceType = (width: number): DeviceType => {
  if (width < 640) return 'mobile';
  if (width < 768) return 'tablet';
  if (width < 1024) return 'smallLaptop';
  if (width < 1440) return 'mediumLaptop';
  if (width < 1920) return 'largeLaptop';
  return 'extraLarge';
};

export const useDeviceDetect = (): DeviceInfo => {
  const [deviceType, setDeviceType] = React.useState<DeviceType>(() =>
    getDeviceType(window.innerWidth),
  );

  React.useEffect(() => {
    const handleResize = () => setDeviceType(getDeviceType(window.innerWidth));
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    type: deviceType,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isSmallLaptop: deviceType === 'smallLaptop',
    isMediumLaptop: deviceType === 'mediumLaptop',
    isLargeLaptop: deviceType === 'largeLaptop',
    isExtraLarge: deviceType === 'extraLarge',
  };
};
