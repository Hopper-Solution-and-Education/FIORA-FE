import { Step } from './types';

/**
 * Utility to extract the first selector from a tour configuration function
 * without requiring real data or hardcoded dummy arrays.
 */
export const getTourFirstSelector = (tourModule: any): string | null => {
  if (!tourModule || typeof tourModule.default !== 'function') return null;

  try {
    // Return dummy step for any numeric index access
    const dummyStep = { id: 'dummy', stepOrder: 0, title: '', description: '' };

    // Create a Proxy that mimics an array of acknowledgment steps
    const stepsProxy = new Proxy([], {
      get(target, prop) {
        if (prop === 'length') return 1000;
        if (prop === 'map') return Array.prototype.map;

        // Handle numeric indices (e.g., steps[0], steps[1])
        if (typeof prop === 'string' && !isNaN(Number(prop))) {
          return dummyStep;
        }
        return Reflect.get(target, prop);
      },
    });

    // Call the mapping function with our magic proxy
    const resolvedSteps: Step[] = tourModule.default(stepsProxy);

    // Extract the selector from the first resolved step
    if (resolvedSteps && resolvedSteps.length > 0 && resolvedSteps[0].selector) {
      return resolvedSteps[0].selector;
    }
  } catch (error) {
    console.error('[tourUtils] Failed to extract first selector:', error);
  }

  return null;
};
