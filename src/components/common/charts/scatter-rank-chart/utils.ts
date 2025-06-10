import { Tier } from './types';

// Function to get the current balance rank label
export const getBalanceRank = (balance: number, balanceTiers: Tier[]) => {
  for (const tier of balanceTiers) {
    if (balance >= tier.min && balance <= tier.max) {
      return tier.label;
    }
  }
  return ''; // Should not happen with correct ranges
};

// Function to get the current spent rank label
export const getSpentRank = (spent: number, spentTiers: Tier[]) => {
  for (const tier of spentTiers) {
    if (spent >= tier.min && spent <= tier.max) {
      return tier.label;
    }
  }
  return ''; // Should not happen with correct ranges
};
