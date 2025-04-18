import { TwoSideBarItem } from '@/components/common/positive-negative-bar-chart-v2/types';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import { generateColor } from '@/shared/lib/charts';
import { TransactionType } from '@prisma/client';

/**
 * Recursively maps a Partner object to a TwoSideBarItem, including its own transactions
 * and those of its descendants.
 * @param partner The Partner object to map
 * @returns A TwoSideBarItem representing the partner and its children
 */
const mapPartnerToTwoSideBarItem = (partner: Partner): TwoSideBarItem => {
  // Recursively map children
  const childrenItems = (partner.children || []).map((child) => mapPartnerToTwoSideBarItem(child));

  // Calculate the partner's own positive and negative values from its transactions
  let ownPositive = 0;
  let ownNegative = 0;

  (partner.transactions || []).forEach((tx) => {
    if (!tx.isDeleted) {
      const amount = parseFloat(String(tx?.amount));
      // Only include non-deleted transactions
      if (tx.type === TransactionType.Income) {
        ownPositive += amount;
      } else if (tx.type === TransactionType.Expense) {
        ownNegative -= amount;
      }
    }
  });

  // Total values include own transactions plus children's totals
  const totalPositive =
    ownPositive + childrenItems.reduce((sum, child) => sum + child.positiveValue, 0);
  const totalNegative =
    ownNegative + childrenItems.reduce((sum, child) => sum + child.negativeValue, 0);
  const isChild: boolean = Boolean(partner.parent !== null);

  return {
    id: partner.id,
    name: partner.name,
    positiveValue: totalPositive,
    negativeValue: totalNegative,
    icon: partner.logo ? partner.logo : undefined,
    type: totalPositive + totalNegative > 0 ? 'income' : 'expense',
    colorPositive: generateColor(totalPositive, isChild),
    colorNegative: generateColor(totalNegative, isChild),
    children: childrenItems,
  };
};

/**
 * Maps an array of Partner objects to an array of TwoSideBarItem objects,
 * starting with top-level partners only.
 * @param data Array of Partner objects from the server response
 * @returns Array of TwoSideBarItem objects for the chart
 */
export const mapPartnersToTwoSideBarItems = (data: Partner[]): TwoSideBarItem[] => {
  // Filter for top-level partners to avoid processing children twice
  const topLevelPartners = data.filter((partner) => partner.parentId === null);
  return topLevelPartners.map((partner) => mapPartnerToTwoSideBarItem(partner));
};
