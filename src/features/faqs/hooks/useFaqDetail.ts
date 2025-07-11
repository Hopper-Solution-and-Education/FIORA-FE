import { Session, useSession } from 'next-auth/react';
import { useState } from 'react';
import { FaqReaction, ReactionCounts, ReactionType } from '../domain/entities/models/faqs';
import {
  useCreateReactionMutation,
  useDeleteReactionMutation,
  useGetFaqDetailQuery,
} from '../store/api/faqsApi';

export const useFaqDetail = (id: string, include: string[] = []) => {
  const { data: session } = useSession() as { data: Session | null };
  // Data fetching - use optimized API with includes and view tracking
  const queryParams =
    include.length > 0 ? { id, include, trackView: true } : { id, trackView: true };

  const { data, error, isLoading, refetch } = useGetFaqDetailQuery(queryParams);

  // Mutations
  const [createReaction] = useCreateReactionMutation();
  const [deleteReaction] = useDeleteReactionMutation();

  // Local state
  const [reactionLoading, setReactionLoading] = useState(false);

  // Calculate reaction counts
  const reactionCounts: ReactionCounts = (() => {
    const counts: ReactionCounts = {
      [ReactionType.BAD]: 0,
      [ReactionType.NEUTRAL]: 0,
      [ReactionType.GOOD]: 0,
    };
    data?.Reaction?.forEach((reaction: FaqReaction) => {
      counts[reaction.reactionType] = (counts[reaction.reactionType] || 0) + 1;
    });
    return counts;
  })();

  // Get user's current reaction
  const userReaction =
    data?.Reaction?.find((reaction: FaqReaction) => reaction.userId === session?.user?.id)
      ?.reactionType || null;

  // Reaction handlers
  const handleReaction = async (type: ReactionType) => {
    if (reactionLoading) return;
    setReactionLoading(true);

    try {
      if (userReaction === type) {
        await deleteReaction(id).unwrap();
      } else {
        await createReaction({
          faqId: id,
          reaction: type,
        }).unwrap();
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    } finally {
      setReactionLoading(false);
      refetch();
    }
  };

  return {
    // Data
    data,
    error,
    isLoading,
    reactionCounts,
    userReaction,

    // State
    reactionLoading,

    // Handlers
    handleReaction,

    // Utils
    refetch,
  };
};
