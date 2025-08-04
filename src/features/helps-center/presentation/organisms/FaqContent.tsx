import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type { FaqDetail } from '../../domain/entities/models/faqs';
import { ParsedFaqContent } from '../atoms';

interface FaqContentProps {
  data: FaqDetail;
  maxHeight?: number;
}

const DEFAULT_MAX_HEIGHT = 500; // pixels
const BUTTON_ANIMATION_DURATION = 200; // ms

const FaqContent: React.FC<FaqContentProps> = ({ data, maxHeight = DEFAULT_MAX_HEIGHT }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkContentHeight = () => {
      if (!contentRef.current) return;

      const contentHeight = contentRef.current.scrollHeight;
      setShowToggle(contentHeight > maxHeight);
    };

    // Check height after content renders
    const timer = setTimeout(checkContentHeight, 100);

    return () => clearTimeout(timer);
  }, [data.content, maxHeight]);

  const handleToggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const getContentClasses = () => {
    const baseClasses = ['transition-all duration-300 ease-in-out', 'overflow-hidden'];

    const heightClasses = [!isExpanded && showToggle ? `max-h-[${maxHeight}px]` : 'max-h-none'];

    return [...baseClasses, ...heightClasses].filter(Boolean).join(' ');
  };

  const getToggleButtonClasses = () => {
    return [
      'text-sm text-blue-600 font-medium',
      'hover:text-blue-800 focus:text-blue-800',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'transition-colors duration-200',
      'rounded-md px-2 py-1',
      'border-none bg-transparent cursor-pointer',
    ].join(' ');
  };

  const renderToggleButton = () => {
    if (!showToggle) return null;

    const buttonText = isExpanded ? 'See less' : 'See more';
    const Icon = isExpanded ? ChevronUp : ChevronDown;
    const ariaLabel = isExpanded ? 'Collapse content to show less' : 'Expand content to show more';

    return (
      <div className="flex flex-col items-center mt-4 mb-6">
        <button
          data-test="faq-content-toggle"
          type="button"
          onClick={handleToggleExpanded}
          className={getToggleButtonClasses()}
          aria-label={ariaLabel}
          aria-expanded={isExpanded}
        >
          {buttonText}
        </button>

        <div className="flex flex-col items-center mt-1 text-blue-600">
          <Icon
            size={18}
            strokeWidth={2}
            className={`transition-transform duration-${BUTTON_ANIMATION_DURATION} ${
              isExpanded ? 'rotate-180' : 'rotate-0'
            }`}
          />
          {!isExpanded && <Icon size={18} strokeWidth={2} className="-mt-1 opacity-60" />}
        </div>
      </div>
    );
  };

  if (!data.content) {
    return <div className="text-gray-500 italic text-center py-4">No content available</div>;
  }

  return (
    <div className="relative">
      <div ref={contentRef} className={getContentClasses()}>
        <ParsedFaqContent htmlContent={data.content} />

        {/* Gradient overlay when content is truncated */}
        {!isExpanded && showToggle && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {renderToggleButton()}
    </div>
  );
};

export default FaqContent;
