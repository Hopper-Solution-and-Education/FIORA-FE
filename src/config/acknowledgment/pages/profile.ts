import { AcknowledgmentStep } from '@/features/acknowledgment/data/dto/response';
import { Step } from '../types';

function getAcknowledgmentProfileSteps(steps: AcknowledgmentStep[]): Step[] {
  if (!steps.length) return [];

  const stepsMapper: Step[] = [
    {
      icon: null,
      selector: '[data-tour="profile-personal-info-section"]',
      title: steps[0].title,
      content: steps[0].description as string,
      side: 'bottom',
      pointerPadding: 10,
      pointerRadius: 10,
    },
    {
      icon: null,
      selector: '[data-tour="profile-personal-info-details"]',
      title: steps[1].title,
      content: steps[1].description as string,
      side: 'bottom',
      pointerRadius: 10,
    },
  ];

  return stepsMapper;
}

export default getAcknowledgmentProfileSteps;
