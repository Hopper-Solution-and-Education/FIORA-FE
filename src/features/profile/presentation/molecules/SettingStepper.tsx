'use client';
import { FC } from 'react';

type StepperItem = {
  id: string;
  label: string;
  isActive?: boolean;
  isCompleted?: boolean;
};

type SettingStepperProps = {
  steps: StepperItem[];
  activeStepIndex?: number;
};

const SettingStepper: FC<SettingStepperProps> = ({ steps, activeStepIndex = 1 }) => {
  return (
    <aside className="w-full lg:w-64">
      <ol className="relative border-l border-gray-200 pl-6 space-y-6">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-start gap-4">
            <span
              aria-hidden
              className={
                'absolute -left-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ' +
                (index === activeStepIndex
                  ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                  : step.isCompleted
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'bg-gray-50 text-gray-600 border-gray-300')
              }
            >
              {step.id}
            </span>
            <div className="text-sm font-medium text-gray-800">{step.label}</div>
          </li>
        ))}
      </ol>
    </aside>
  );
};

export default SettingStepper;
