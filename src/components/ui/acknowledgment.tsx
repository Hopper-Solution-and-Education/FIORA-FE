'use client';
import type { CardComponentProps } from 'onborda';
import { useOnborda } from 'onborda';
import React, { useEffect } from 'react';

// Shadcn
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/shared/utils';

// Icons
import { hideAcknowledgment } from '@/features/acknowledgment/slides';
import { updateCompleteAcknowledgmentAsyncThunk } from '@/features/acknowledgment/slides/actions/updateCompleteAcknowledgmentAsyncThunk';
import { useTourMapper } from '@/shared/hooks/useTourMapper';
import { setSkip } from '@/shared/utils/skipTour';
import { useAppDispatch } from '@/store';
import { CheckCircle, ChevronLeft, ChevronRight, SkipForward } from 'lucide-react';

export const TourCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}) => {
  const { closeOnborda } = useOnborda();
  const featureKey = useTourMapper();
  const dispatch = useAppDispatch();

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep + 1 === totalSteps;

  const handleSkip = () => {
    setSkip(featureKey as string);
    dispatch(hideAcknowledgment());
    closeOnborda();
  };

  const handleComplete = () => {
    dispatch(updateCompleteAcknowledgmentAsyncThunk(featureKey as string));
    closeOnborda();
  };

  useEffect(() => {
    // Delay slightly to ensure DOM updates
    setTimeout(() => window.dispatchEvent(new Event('resize')), 400);
  }, [currentStep]);

  if (!step) return null;

  return (
    <Card
      className={cn(
        // Base styles
        'border-0 shadow-2xl z-[9999]',
        'bg-gradient-to-br from-white to-gray-50',
        'dark:from-gray-900 dark:to-gray-800',
        // Responsive width
        'w-[90vw] max-w-sm sm:max-w-md lg:max-w-3xl rounded-xl',
        // Smooth animations
        'transition-all duration-500 ease-in-out',
      )}
    >
      {/* Header */}
      <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col space-y-1 flex-1 pr-8">
            {/* Progress indicator */}
            <CardDescription className="text-xs font-medium text-primary/70 dark:text-primary/60 mb-2">
              Step {currentStep + 1} of {totalSteps}
            </CardDescription>

            {/* Title */}
            <CardTitle className="text-lg sm:text-lg font-semibold text-foreground flex items-center gap-2">
              {step.icon && <span className="flex-shrink-0">{step.icon}</span>}
              <span className="line-clamp-2">{step.title}</span>
            </CardTitle>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-muted rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              currentStep === totalSteps - 1 ? 'bg-green-600' : 'bg-primary/50'
            }`}
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-4 sm:px-6">
        <div className="text-base text-foreground leading-relaxed">{step.content}</div>
      </CardContent>

      {/* Footer with buttons */}
      <CardFooter className="px-4 sm:px-6 pb-4 pt-2">
        <div className="w-full flex justify-between gap-10">
          {/* Skip button row */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className={cn(
              'h-11 px-3 sm:px-4',
              'text-sm text-foreground',
              'hover:text-foreground hover:bg-muted',
              'transition-colors',
            )}
          >
            <SkipForward className="h-3 w-3 mr-1.5" />
            Skip this time
          </Button>

          {/* Navigation buttons row */}
          <div className="flex flex-1 items-center justify-between gap-2">
            {/* Previous button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => prevStep()}
              disabled={isFirstStep}
              className={cn(
                'w-1/2 sm:flex-none',
                'h-11 px-3 sm:px-4',
                'text-sm',
                'transition-all duration-200',
                isFirstStep && 'opacity-0 pointer-events-none',
              )}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Back</span>
            </Button>

            {/* Next button */}
            {!isLastStep ? (
              <Button
                size="sm"
                onClick={() => nextStep()}
                className={cn(
                  'w-1/2 sm:flex-none',
                  'h-11 px-3 sm:px-4',
                  'text-sm',
                  'bg-blue-600 hover:bg-blue-700',
                  'transition-all duration-200',
                )}
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleComplete}
                className={cn(
                  'w-1/2 sm:flex-none',
                  'h-11 px-3 sm:px-4',
                  'text-sm',
                  'bg-green-600 hover:bg-green-700',
                  'transition-all duration-200',
                )}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>I got it!</span>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>

      {/* Arrow for positioning */}
      <span
        className={cn(
          // Base styles
          'border-0 shadow-2xl z-[9999]',
          'text-white',
          'dark:text-primary',
          // Responsive width
          'w-[90vw] max-w-sm sm:max-w-md lg:max-w-lg rounded-xl',
          // Smooth animations
          'transition-all duration-500 ease-in-out',
        )}
      >
        {arrow}
      </span>
    </Card>
  );
};
