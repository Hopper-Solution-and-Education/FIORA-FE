'use client';

import { FeatureKey, featureMap } from '@/config/acknowledgment/pages';
import { useOnborda } from 'onborda';
import { useEffect, useRef, useState } from 'react';

interface UseTourOptions {
  /** The tour/feature key (must match a key in featureMap, e.g., 'homepage_tour') */
  tourName: FeatureKey;
  /** Polling interval in ms to check for element existence (default: 200) */
  pollInterval?: number;
  /** Maximum time to wait for element in ms (default: 10000) */
  maxWaitTime?: number;
  /** Whether the tour should start automatically (default: true) */
  autoStart?: boolean;
}

/**
 * Custom hook to start an Onborda tour when the first step's target element exists.
 *
 * The target selector is automatically determined from the feature's step configuration,
 * so you don't need to specify it manually. Each feature file (e.g., homepage.ts)
 * defines its own steps.
 *
 * @example
 * ```tsx
 * // Simple usage - just provide the tour name from AcknowledgmentFeatureKey
 * useTour({ tourName: AcknowledgmentFeatureKey.HOMEPAGE });
 *
 * // With custom options
 * useTour({
 *   tourName: AcknowledgmentFeatureKey.SETTINGS,
 *   pollInterval: 100,
 *   maxWaitTime: 5000,
 * });
 *
 * // Manual control
 * const { startTour, closeTour } = useTour({
 *   tourName: AcknowledgmentFeatureKey.ONBOARDING,
 *   autoStart: false,
 * });
 * ```
 */
export function useTour(options: UseTourOptions) {
  const { tourName, pollInterval = 200, maxWaitTime = 10000, autoStart = true } = options;

  const { startOnborda, closeOnborda } = useOnborda();
  const hasStartedRef = useRef(false);
  const [firstSelector, setFirstSelector] = useState<string | null>(null);

  // Load the feature module and get the first step's selector
  useEffect(() => {
    const loadFeatureConfig = async () => {
      try {
        const featureLoader = featureMap[tourName];
        if (!featureLoader) {
          console.warn(`[useTour] Feature "${tourName}" not found in featureMap`);
          return;
        }

        const mod = await featureLoader();
        // Get steps with dummy data (just to get the selectors structure)
        // The actual data will come from the API, but we need the selector pattern
        const dummySteps = mod.default([
          { id: '1', stepOrder: 0, title: '', description: '' },
          { id: '2', stepOrder: 1, title: '', description: '' },
        ]);

        if (dummySteps.length > 0 && dummySteps[0].selector) {
          setFirstSelector(dummySteps[0].selector);
        }
      } catch (error) {
        console.error(`[useTour] Failed to load feature config for "${tourName}":`, error);
      }
    };

    loadFeatureConfig();
  }, [tourName]);

  // Start the tour when the first element exists
  useEffect(() => {
    if (!autoStart || !firstSelector) return;

    let cancelled = false;
    const startTime = Date.now();

    const checkAndStartTour = () => {
      if (cancelled || hasStartedRef.current) return;

      const elapsed = Date.now() - startTime;
      if (elapsed > maxWaitTime) {
        console.warn(
          `[useTour] Timeout: Element "${firstSelector}" not found within ${maxWaitTime}ms`,
        );
        return;
      }

      const targetElement = document.querySelector(firstSelector);
      if (targetElement) {
        hasStartedRef.current = true;
        startOnborda(tourName);
      } else {
        setTimeout(checkAndStartTour, pollInterval);
      }
    };

    setTimeout(checkAndStartTour, pollInterval);

    return () => {
      cancelled = true;
    };
  }, [tourName, firstSelector, pollInterval, maxWaitTime, autoStart, startOnborda]);

  // Manual start function
  const startTour = () => {
    if (!firstSelector) {
      console.warn(`[useTour] Cannot start: Feature config not loaded yet`);
      return;
    }

    const targetElement = document.querySelector(firstSelector);
    if (targetElement) {
      hasStartedRef.current = true;
      startOnborda(tourName);
    } else {
      console.warn(`[useTour] Cannot start tour: Element "${firstSelector}" not found`);
    }
  };

  // Reset to allow tour to be started again
  const resetTour = () => {
    hasStartedRef.current = false;
    closeOnborda();
  };

  return {
    startTour,
    resetTour,
    closeTour: closeOnborda,
    firstSelector,
  };
}
