import { Frown, Meh, Smile, type LucideIcon } from 'lucide-react';
import { Session } from 'next-auth/react';
import React from 'react';
import { ReactionCounts, ReactionType } from '../../domain/entities/models/faqs';

interface FeedbackSectionProps {
  reactionCounts: ReactionCounts;
  userReaction: ReactionType | null;
  onReaction: (type: ReactionType) => void;
  disabled?: boolean;
  setOpenWarningDialog: (open: boolean) => void;
  session?: Session | null;
}

interface ReactionConfig {
  type: ReactionType;
  icon: LucideIcon;
  activeColor: string;
  label: string;
}

const REACTION_CONFIGS: readonly ReactionConfig[] = [
  { type: ReactionType.BAD, icon: Frown, activeColor: 'text-red-500', label: 'Not helpful' },
  {
    type: ReactionType.NEUTRAL,
    icon: Meh,
    activeColor: 'text-yellow-600',
    label: 'Somewhat helpful',
  },
  { type: ReactionType.GOOD, icon: Smile, activeColor: 'text-green-500', label: 'Very helpful' },
] as const;

const ICON_SIZE = 40;
const DEFAULT_COLOR = 'text-yellow-400';

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  reactionCounts,
  userReaction,
  onReaction,
  disabled = false,
  setOpenWarningDialog,
  session,
}) => {
  const handleReactionClick = (type: ReactionType) => {
    if (!session?.user?.id) {
      setOpenWarningDialog(true);
      return;
    }

    if (!disabled) {
      onReaction(type);
    }
  };

  const getButtonClasses = (isSelected: boolean) => {
    const baseClasses = [
      'flex flex-col items-center',
      'transition-all duration-200 transform',
      'rounded-lg p-2 border-none',
    ];

    const stateClasses = [
      isSelected ? 'scale-110' : '',
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      'hover:scale-110',
    ];

    return [...baseClasses, ...stateClasses].filter(Boolean).join(' ');
  };

  const getIconColor = (type: ReactionType, isSelected: boolean) => {
    if (!isSelected) return DEFAULT_COLOR;

    const config = REACTION_CONFIGS.find((config) => config.type === type);
    return config?.activeColor || DEFAULT_COLOR;
  };

  return (
    <div className="text-center my-8">
      <p className="font-semibold mb-4 text-gray-700">Did this answer your question?</p>
      <div className="flex justify-center gap-8">
        {REACTION_CONFIGS.map(({ type, icon: Icon, label }) => {
          const isSelected = userReaction === type;
          const count = reactionCounts[type] || 0;
          const iconColor = getIconColor(type, isSelected);

          return (
            <button
              key={type}
              onClick={() => handleReactionClick(type)}
              disabled={disabled}
              className={getButtonClasses(isSelected)}
              aria-label={`Rate as ${label}. Current count: ${count}`}
              title={label}
              type="button"
            >
              <Icon size={ICON_SIZE} className={`${iconColor} transition-colors duration-200`} />
              <span className="text-sm font-semibold mt-2 text-gray-600">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackSection;
