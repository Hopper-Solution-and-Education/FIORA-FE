'use client';

import { featureMap } from '@/config/acknowledgment/pages';
import { Step, Tour } from '@/config/acknowledgment/types';
import { getAcknowledgmentAsyncThunk } from '@/features/acknowledgment/slides/actions/getAcknowledgmentAsyncThunk';
import { useTourMapper } from '@/shared/hooks/useTourMapper';
import { RootState, useAppDispatch } from '@/store';
import { useSession } from 'next-auth/react';
import { Onborda, OnbordaProvider, useOnborda } from 'onborda';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { TourCard } from '../ui/acknowledgment';

import { getTourFirstSelector } from '@/config/acknowledgment/tourUtils';
import { isSkipped } from '@/shared/utils/skipTour';

/**
 * Inner component that handles auto-starting tours based on route
 */
function TourAutoStarter({ children }: { children: React.ReactNode }) {
  const { startOnborda } = useOnborda();
  const { data } = useSelector((state: RootState) => state.acknowledgment);
  const hasStartedRef = useRef<string | null>(null);
  const [firstSelector, setFirstSelector] = useState<string | null>(null);

  // Get the feature key for current route using useTourMapper
  const featureKey = useTourMapper();

  // Load the first step's selector when feature key changes
  useEffect(() => {
    if (!featureKey) {
      setFirstSelector(null);
      return;
    }

    // Skip tours if user has skipped
    if (isSkipped(featureKey)) return;

    const loadFeatureConfig = async () => {
      try {
        const featureLoader = featureMap[featureKey];
        if (!featureLoader) return;

        const mod = await featureLoader();

        // Extract selector using utility
        const selector = getTourFirstSelector(mod);
        if (selector) {
          setFirstSelector(selector);
        }
      } catch (error) {
        console.error(`[TourAutoStarter] Failed to load feature config:`, error);
      }
    };

    loadFeatureConfig();
  }, [featureKey, data]);

  // Auto-start tour when element exists and data is loaded
  useEffect(() => {
    if (!featureKey || !firstSelector || !data?.[featureKey]) return;
    if (hasStartedRef.current === featureKey) return; // Already started for this route

    let cancelled = false;
    const startTime = Date.now();
    const maxWaitTime = 10000;
    const pollInterval = 200;

    const checkAndStartTour = () => {
      if (cancelled) return;

      const elapsed = Date.now() - startTime;
      if (elapsed > maxWaitTime) {
        console.warn(`[TourAutoStarter] Timeout: Element "${firstSelector}" not found`);
        return;
      }

      const targetElement = document.querySelector(firstSelector);
      if (targetElement) {
        hasStartedRef.current = featureKey;
        startOnborda(featureKey);
      } else {
        setTimeout(checkAndStartTour, pollInterval);
      }
    };

    setTimeout(checkAndStartTour, pollInterval);

    return () => {
      cancelled = true;
    };
  }, [featureKey, firstSelector, data, startOnborda]);

  // Reset when route changes
  useEffect(() => {
    hasStartedRef.current = null;
  }, [featureKey]);

  return <>{children}</>;
}

function AcknowledgmentProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { status } = useSession();
  const { data, isLoaded } = useSelector((state: RootState) => state.acknowledgment);
  const [tours, setTours] = useState<Tour[]>([]);

  // Fetch data if missing or user just logged in
  useEffect(() => {
    if (status === 'authenticated' && !isLoaded) {
      dispatch(getAcknowledgmentAsyncThunk(false));
    }
  }, [status, isLoaded, dispatch]);

  // Load all feature tours from the featureMap
  useEffect(() => {
    const loadAllTours = async () => {
      const loadedTours: Tour[] = [];

      for (const [featureKey, loader] of Object.entries(featureMap)) {
        try {
          const mod = await loader();
          const featureData = data?.[featureKey];

          const steps: Step[] = featureData?.steps ? mod.default(featureData.steps) : [];

          if (steps.length > 0) {
            loadedTours.push({
              tour: featureKey,
              steps,
            });
          }
        } catch (error) {
          console.error(`[AcknowledgmentProvider] Failed to load feature "${featureKey}":`, error);
        }
      }

      setTours(loadedTours);
    };

    loadAllTours();
  }, [data]);

  // Resize on scroll to fix popper position
  useEffect(() => {
    const handleScroll = () => window.dispatchEvent(new Event('resize'));
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <OnbordaProvider>
      <Onborda
        steps={tours}
        showOnborda={true}
        shadowRgb="0, 0, 0"
        shadowOpacity="0.8"
        cardComponent={TourCard}
        cardTransition={{ duration: 0.35, type: 'tween' }}
      >
        <TourAutoStarter>{children}</TourAutoStarter>
      </Onborda>
    </OnbordaProvider>
  );
}

export default AcknowledgmentProvider;
