import { Tier } from '@/components/common/charts/scatter-rank-chart/types';
import { Membership } from '../../domain/entities';

export const transformToBalanceTiers = (memberships: Membership[]): Tier[] => {
  if (!memberships || memberships.length === 0) {
    return [];
  }

  // Group memberships by balance thresholds and create unique tiers
  const balanceGroups = new Map<string, Tier>();

  memberships.forEach((membership) => {
    const key = `${membership.balanceMinThreshold}-${membership.balanceMaxThreshold}`;
    if (!balanceGroups.has(key)) {
      balanceGroups.set(key, {
        label: membership.tierName,
        min: membership.balanceMinThreshold,
        max: membership.balanceMaxThreshold === 0 ? Infinity : membership.balanceMaxThreshold,
        value: membership.balanceMinThreshold,
        icon: membership.mainIconUrl || 'https://placehold.co/60x60/80e0ff/000000?text=Default',
      });
    }
  });

  // Sort by min, then max, and return as array
  return Array.from(balanceGroups.values()).sort((a, b) => {
    if (a.min !== b.min) return a.min - b.min;
    return (
      (a.max === Infinity ? Number.MAX_VALUE : a.max) -
      (b.max === Infinity ? Number.MAX_VALUE : b.max)
    );
  });
};
// Transform API data into spent tiers
export const transformToSpentTiers = (memberships: Membership[]): Tier[] => {
  if (!memberships || memberships.length === 0) {
    return [];
  }

  // Group memberships by spent thresholds and create unique tiers
  const spentGroups = new Map<string, Tier>();

  memberships.forEach((membership) => {
    const key = `${membership.spentMinThreshold}-${membership.spentMaxThreshold}`;
    if (!spentGroups.has(key)) {
      spentGroups.set(key, {
        label: membership.tierName,
        min: membership.spentMinThreshold,
        max: membership.spentMaxThreshold === 0 ? Infinity : membership.spentMaxThreshold,
        value: membership.spentMinThreshold,
        icon: membership.mainIconUrl || 'https://placehold.co/60x60/808080/000000?text=Default',
      });
    }
  });

  // Sort by min, then max, and return as array
  return Array.from(spentGroups.values()).sort((a, b) => {
    if (a.min !== b.min) return a.min - b.min;
    return (
      (a.max === Infinity ? Number.MAX_VALUE : a.max) -
      (b.max === Infinity ? Number.MAX_VALUE : b.max)
    );
  });
};

// Create combined tier icons mapping with onClick handlers
export const createCombinedTierIcons = (
  balanceTiers: Tier[],
  spentTiers: Tier[],
  memberships: Membership[],
  onTierClick: (balanceTier: Tier, spentTier: Tier, membership?: Membership) => void,
): Record<string, any> => {
  const icons: Record<string, any> = {};

  balanceTiers.forEach((balanceTier) => {
    spentTiers.forEach((spentTier) => {
      const key = `${balanceTier.label}-${spentTier.label}`;

      // Find the membership that matches this combination
      const matchingMembership = memberships?.find(
        (membership) =>
          membership.balanceMinThreshold === balanceTier.min &&
          membership.balanceMaxThreshold === (balanceTier.max === Infinity ? 0 : balanceTier.max) &&
          membership.spentMinThreshold === spentTier.min &&
          membership.spentMaxThreshold === (spentTier.max === Infinity ? 0 : spentTier.max),
      );

      // If no exact match, find the closest one based on min thresholds
      const fallbackMembership = !matchingMembership
        ? memberships?.find(
            (membership) =>
              membership.balanceMinThreshold === balanceTier.min &&
              membership.spentMinThreshold === spentTier.min,
          )
        : null;

      const selectedMembership = matchingMembership || fallbackMembership;

      icons[key] = {
        icon: selectedMembership?.mainIconUrl || balanceTier.icon,
        onClick: onTierClick,
        selectedMembership: selectedMembership || null,
        balanceTier,
        spentTier,
        item: selectedMembership || null,
      };
    });
  });

  return icons;
};
