import ScatterRankingChart from '@/components/common/charts/scatter-rank-chart';
import { Tier } from '@/components/common/charts/scatter-rank-chart/types';
import { COLORS } from '@/shared/constants/chart';
import { useState } from 'react';

const balanceTiers = [
  {
    label: 'Egg',
    min: 0,
    max: 9999,
    value: 0,
    icon: 'https://placehold.co/60x60/80e0ff/000000?text=Egg',
  },
  {
    label: 'Tortoise',
    min: 10000,
    max: 19999,
    value: 10000,
    icon: 'https://placehold.co/60x60/80ff80/000000?text=Tortoise',
  },
  {
    label: 'Phoenix',
    min: 20000,
    max: 49999,
    value: 20000,
    icon: 'https://placehold.co/60x60/ff8080/000000?text=Phoenix',
  },
  {
    label: 'Qili',
    min: 50000,
    max: 99999,
    value: 50000,
    icon: 'https://placehold.co/60x60/ffff80/000000?text=Qili',
  },
  {
    label: 'Dragon',
    min: 100000,
    max: Infinity,
    value: 100000,
    icon: 'https://placehold.co/60x60/d180ff/000000?text=Dragon',
  },
];

const spentTiers = [
  {
    label: 'Titan',
    min: 0,
    max: 9999,
    value: 0,
    icon: 'https://placehold.co/60x60/808080/000000?text=Titan',
  },
  {
    label: 'Silver',
    min: 10000,
    max: 19999,
    value: 10000,
    icon: 'https://placehold.co/60x60/C0C0C0/000000?text=Silver',
  },
  {
    label: 'Gold',
    min: 20000,
    max: 49999,
    value: 20000,
    icon: 'https://placehold.co/60x60/FFD700/000000?text=Gold',
  },
  {
    label: 'Platinum',
    min: 50000,
    max: 99999,
    value: 50000,
    icon: 'https://placehold.co/60x60/E5E4E2/000000?text=Platinum',
  },
  {
    label: 'Diamond',
    min: 100000,
    max: Infinity,
    value: 100000,
    icon: 'https://placehold.co/60x60/B9F2FF/000000?text=Diamond',
  },
];

// Combined tier icons mapping with onClick handlers

const ExampleScatterRankChart = () => {
  const [selectedItem, setSelectedItem] = useState<{ balance: number; spent: number } | null>({
    balance: 0,
    spent: 0,
  });

  const combinedTierIcons = {
    'Egg-Titan': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Egg-Titan',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Egg-Silver': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Egg-Silver',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Egg-Gold': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Egg-Gold',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Egg-Platinum': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Egg-Platinum',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Egg-Diamond': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Egg-Diamond',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Tortoise-Titan': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Tortoise-Titan',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Tortoise-Silver': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Tortoise-Silver',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Tortoise-Gold': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Tortoise-Gold',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Tortoise-Platinum': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Tortoise-Platinum',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Tortoise-Diamond': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Tortoise-Diamond',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Phoenix-Titan': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Phoenix-Titan',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Phoenix-Silver': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Phoenix-Silver',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Phoenix-Gold': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Phoenix-Gold',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Phoenix-Platinum': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Phoenix-Platinum',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Phoenix-Diamond': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Phoenix-Diamond',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Qili-Titan': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Qili-Titan',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Qili-Silver': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Qili-Silver',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Qili-Gold': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Qili-Gold',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Qili-Platinum': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Qili-Platinum',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Qili-Diamond': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Qili-Diamond',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Dragon-Titan': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Dragon-Titan',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Dragon-Silver': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Dragon-Silver',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Dragon-Gold': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Dragon-Gold',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Dragon-Platinum': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Dragon-Platinum',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
    'Dragon-Diamond': {
      icon: 'https://placehold.co/60x60/80e0ff/000000?text=Dragon-Diamond',
      onClick: (balanceTier: Tier, spentTier: Tier) => {
        setSelectedItem({ balance: balanceTier.min, spent: spentTier.min });
      },
    },
  };

  return (
    <div className="shadow col-span-5 rounded-lg">
      <ScatterRankingChart
        currentTier={selectedItem || { balance: 0, spent: 0 }}
        balanceTiers={balanceTiers}
        spentTiers={spentTiers}
        xLegend={{
          items: [
            { name: 'Total Spent (FX)', color: COLORS.DEPS_INFO.LEVEL_5 },
            { name: 'Actual Spent (FX)', color: COLORS.DEPS_INFO.LEVEL_1 },
          ],
        }}
        yLegend={{
          items: [
            { name: 'Actual Balance (FX)', color: COLORS.DEPS_SUCCESS.LEVEL_1 },
            { name: 'Total Balance (FX)', color: COLORS.DEPS_SUCCESS.LEVEL_5 },
          ],
        }}
        barColors={{
          xBg: COLORS.DEPS_INFO.LEVEL_5,
          x: COLORS.DEPS_INFO.LEVEL_1,
          yBg: COLORS.DEPS_SUCCESS.LEVEL_5,
          y: COLORS.DEPS_SUCCESS.LEVEL_1,
        }}
        combinedTierIcons={combinedTierIcons}
      />
    </div>
  );
};

export default ExampleScatterRankChart;
