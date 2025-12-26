'use client';

import { getAcknowledgmentAsyncThunk } from '@/features/acknowledgment/slides/actions/getAcknowledgmentAsyncThunk';
import { getAcknowledgmentFeatureStepsAsyncThunk } from '@/features/acknowledgment/slides/actions/getAcknowledgmentFeatureStepsAsyncThunk';
import { AcknowledgmentFeatureSteps } from '@/shared/constants';
import { useTourMapper } from '@/shared/hooks/useTourMapper';
import { Tour } from '@/shared/types';
import { htmlToReactNode } from '@/shared/utils/parserHTML2ReactNode';
import { isSkipped } from '@/shared/utils/skipTour';
import { RootState, useAppDispatch } from '@/store';
import { useSession } from 'next-auth/react';
import { Onborda, OnbordaProvider, useOnborda } from 'onborda';
import { ReactNode, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TourCard } from '../ui/acknowledgment';

/* ---------- constants ---------- */
const POLL_MS = 200;
const MAX_WAIT_MS = 10_000;

/* ---------- helpers ---------- */
const pollElement = (
  selector: string,
  onFound: () => void,
  onTimeout?: () => void,
): (() => void) => {
  let id: ReturnType<typeof setTimeout>;
  const start = Date.now();

  const run = () => {
    if (document.querySelector(selector)) return onFound();
    if (Date.now() - start > MAX_WAIT_MS) return onTimeout?.();
    id = setTimeout(run, POLL_MS);
  };
  run();

  return () => clearTimeout(id);
};

/* ---------- components ---------- */
function TourAutoStarter({ children }: { children: ReactNode }) {
  const { startOnborda, closeOnborda } = useOnborda();
  const { data } = useSelector((state: RootState) => state.acknowledgment);
  const featureKey = useTourMapper();

  const shouldStart =
    featureKey && !isSkipped(featureKey) && Boolean(data?.[featureKey]?.steps?.length);

  useEffect(() => {
    if (!shouldStart) {
      closeOnborda();
      return;
    }

    const selector = AcknowledgmentFeatureSteps[featureKey]?.[0]?.selector;
    if (!selector) return;

    const cancel = pollElement(selector, () => startOnborda(featureKey));
    return cancel;
  }, [shouldStart, featureKey, data, startOnborda, closeOnborda]);

  return <>{children}</>;
}

function AcknowledgmentProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { status } = useSession();
  const { data, isLoaded, isVisible } = useSelector((state: RootState) => state.acknowledgment);
  const featureKey = useTourMapper();

  /* 1. fetch acknowledgment feature completed yet if missing */
  useEffect(() => {
    if (status === 'authenticated' && !isLoaded) {
      dispatch(getAcknowledgmentAsyncThunk(false));
    }
  }, [status, isLoaded, dispatch]);

  /* 2. fetch steps only when needed */
  useEffect(() => {
    if (!featureKey) return;
    const feature = data?.[featureKey];
    if (!feature) return;
    if (feature.steps) return;
    if (isSkipped(featureKey)) return;

    dispatch(getAcknowledgmentFeatureStepsAsyncThunk(feature.id));
  }, [featureKey, data, dispatch]);

  /* 3. build tours – pure compute */
  const tours = useMemo<Tour[]>(() => {
    if (!featureKey) return [];
    const steps = data?.[featureKey]?.steps;
    if (!steps?.length) return [];

    const configSteps = AcknowledgmentFeatureSteps[featureKey];
    if (!configSteps?.length) return [];

    return [
      {
        tour: featureKey,
        steps: configSteps.map((cfg, i) => ({
          icon: cfg.icon ?? null,
          ...cfg,
          title: steps[i]?.title ?? '',
          content: htmlToReactNode(steps[i]?.description ?? ''),
        })),
      },
    ];
  }, [featureKey, data]);

  const shouldRenderTour =
    tours.length > 0 && !isSkipped(featureKey as keyof typeof AcknowledgmentFeatureSteps);
  const tourKey = `${featureKey}-${shouldRenderTour}`;

  return (
    <OnbordaProvider>
      {shouldRenderTour && isVisible ? (
        <Onborda
          key={tourKey}
          steps={tours}
          showOnborda
          shadowRgb="0, 0, 0"
          shadowOpacity="0.8"
          cardComponent={TourCard}
          cardTransition={{ duration: 0.35, type: 'tween' }}
        >
          <TourAutoStarter>{children}</TourAutoStarter>
        </Onborda>
      ) : (
        <>{children}</>
      )}
    </OnbordaProvider>
  );
}

export default AcknowledgmentProvider;
