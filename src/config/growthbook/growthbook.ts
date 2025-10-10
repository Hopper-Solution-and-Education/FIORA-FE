import { GrowthBook } from '@growthbook/growthbook';

const growthbook = new GrowthBook({
  apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
  clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
  enableDevMode: process.env.NODE_ENV === 'development',
  trackingCallback: (experiment, result) => {
    console.log('Viewed Experiment', {
      experimentId: experiment.key,
      variationId: result.key,
    });
  },
});

// Function to initialize GrowthBook
export async function initGrowthBook() {
  await growthbook.init();
}

// Export GrowthBook instance
export default growthbook;
