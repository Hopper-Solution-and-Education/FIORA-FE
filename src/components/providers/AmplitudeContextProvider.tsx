'use client';

import { init, track } from '@amplitude/analytics-browser';
import React, { createContext, ReactNode, useContext, useEffect } from 'react';

interface AmplitudeContextProps {
  trackEvent: (eventName: string, eventProperties?: Record<string, any>) => void;
}

export const AmplitudeContext = createContext<AmplitudeContextProps | undefined>(undefined);

interface AmplitudeProviderProps {
  children: ReactNode;
}

const AmplitudeProvider: React.FC<AmplitudeProviderProps> = ({ children }) => {
  useEffect(() => {
    const AMPLITUDE_API_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;

    if (!AMPLITUDE_API_KEY) {
      console.warn(
        'Amplitude API Key is missing. Please set NEXT_PUBLIC_AMPLITUDE_API_KEY in your environment variables.',
      );
      return;
    }

    init(AMPLITUDE_API_KEY, undefined, {
      defaultTracking: {
        sessions: true,
      },
    });
  }, []);

  const trackEvent = (eventName: string, eventProperties?: Record<string, any>) => {
    track(eventName, eventProperties);
  };

  return <AmplitudeContext.Provider value={{ trackEvent }}>{children}</AmplitudeContext.Provider>;
};

const useAmplitude = (): AmplitudeContextProps => {
  const context = useContext(AmplitudeContext);
  if (!context) {
    throw new Error('useAmplitude must be used within an AmplitudeProvider');
  }
  return context;
};

export { AmplitudeProvider, useAmplitude };
