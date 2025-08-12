import { Frown, Meh, Smile, type LucideIcon } from 'lucide-react';
import { Session } from 'next-auth/react';
import React from 'react';
import { toast } from 'sonner';
import { FaqReaction, ReactionCounts, ReactionType } from '../../domain/entities/models/faqs';
import { useCreateReactionMutation, useGetFaqReactionsQuery } from '../../store/api/helpsCenterApi';

interface FeedbackSectionProps {
  faqId: string;
  session?: Session | null;
  setOpenWarningDialog: (open: boolean) => void;
}

interface ReactionConfig {
  type: ReactionType;
  icon: LucideIcon;
  activeColor: string;
  groupHoverClass: string;
  label: string;
}

const REACTION_CONFIGS: readonly ReactionConfig[] = [
  {
    type: ReactionType.BAD,
    icon: Frown,
    activeColor: 'text-red-500',
    groupHoverClass: 'group-hover:text-red-400',
    label: 'Not helpful',
  },
  {
    type: ReactionType.NEUTRAL,
    icon: Meh,
    activeColor: 'text-yellow-500',
    groupHoverClass: 'group-hover:text-yellow-400',
    label: 'Somewhat helpful',
  },
  {
    type: ReactionType.GOOD,
    icon: Smile,
    activeColor: 'text-green-500',
    groupHoverClass: 'group-hover:text-green-400',
    label: 'Very helpful',
  },
] as const;

const ICON_SIZE = 40;
const DEFAULT_COLOR = 'text-gray-400';

const FeedbackSection: React.FC<FeedbackSectionProps> = ({
  faqId,
  session,
  setOpenWarningDialog,
}) => {
  // Fetch reactions
  const { data: reactions, isLoading: isGettingReactions } = useGetFaqReactionsQuery(faqId);
  const [createReaction, { isLoading: isCreatingReaction }] = useCreateReactionMutation();
  const isLoadingReactions = isGettingReactions || isCreatingReaction;

  // Compute counts and user reaction
  const reactionCounts: ReactionCounts = React.useMemo(() => {
    const counts: ReactionCounts = {
      [ReactionType.BAD]: 0,
      [ReactionType.NEUTRAL]: 0,
      [ReactionType.GOOD]: 0,
    };
    reactions?.forEach((reaction: FaqReaction) => {
      counts[reaction.reactionType] = (counts[reaction.reactionType] || 0) + 1;
    });
    return counts;
  }, [reactions]);
  const userReaction =
    reactions?.find((reaction) => reaction.userId === session?.user?.id)?.reactionType || null;

  // Reaction handler
  const handleReaction = async (type: ReactionType) => {
    if (!session?.user?.id) {
      setOpenWarningDialog(true);
      return;
    }
    try {
      const tempReactions = (reactions || []).filter(
        (reaction) => reaction.userId !== session?.user?.id,
      );
      tempReactions.push({
        id: 'optimistic-' + Date.now(),
        reactionType: type,
        userId: session?.user?.id,
      });
      await createReaction({ faqId, reaction: type, tempReactions }).unwrap();
    } catch (error) {
      console.error('Error creating reaction:', error);
      toast.error('Failed to react. Please try again.');
    }
  };

  return (
    <div className="text-center my-8">
      <p className="font-semibold mb-4 text-gray-700">Did this answer your question?</p>
      <div className="flex justify-center gap-8">
        {REACTION_CONFIGS.map(({ type, icon: Icon, label, activeColor, groupHoverClass }) => {
          const isSelected = userReaction === type;
          const count = reactionCounts[type] || 0;
          return (
            <button
              data-test="feedback-section-reaction"
              key={type}
              onClick={() => handleReaction(type)}
              disabled={isLoadingReactions}
              className={[
                'flex flex-col items-center',
                'transition-all duration-200 transform',
                'rounded-lg p-2 border-none',
                isSelected ? 'scale-110' : '',
                isLoadingReactions ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                'hover:scale-110',
                'group',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={`Rate as ${label}. Current count: ${count}`}
              title={label}
              type="button"
            >
              <Icon
                size={ICON_SIZE}
                className={`transition-colors duration-200 ${isSelected ? activeColor : DEFAULT_COLOR} ${groupHoverClass}`}
              />
              <span className="text-sm font-semibold mt-2 text-gray-600">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackSection;
