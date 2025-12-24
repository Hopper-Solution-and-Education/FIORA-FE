import { AcknowledgmentStep } from '@/features/acknowledgment/data/dto/response';
import { Step } from '../types';

function getAcknowledgmentHomepageSteps(steps: AcknowledgmentStep[]): Step[] {
  if (!steps.length) return [];

  const stepsMapper: Step[] = [
    {
      icon: null,
      selector: '[data-tour="homepage-logo"]',
      title: steps[0].title,
      content: steps[0].description as string,
      side: 'right',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      icon: null,
      selector: '[data-tour="homepage-finance-summary"]',
      title: steps[1].title,
      content: steps[1].description as string,
      side: 'bottom',
      pointerRadius: 10,
    },
    {
      icon: null,
      selector: '[data-tour="homepage-notification"]',
      title: steps[2].title,
      content: steps[2].description as string,
      side: 'bottom',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      icon: null,
      selector: '[data-tour="homepage-rewards"]',
      title: steps[3].title,
      content: steps[3].description as string,
      side: 'bottom',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      icon: null,
      selector: '[data-tour="homepage-news"]',
      title: steps[4].title,
      content: steps[4].description as string,
      side: 'bottom',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      icon: null,
      selector: '[data-tour="homepage-help-center"]',
      title: steps[5].title,
      content: steps[5].description as string,
      side: 'bottom',
      pointerPadding: 10,
      pointerRadius: 10,
    },
  ];

  return stepsMapper;
}

export default getAcknowledgmentHomepageSteps;
