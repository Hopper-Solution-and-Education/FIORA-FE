import { TwoSideBarItem } from '@/components/common/charts/positive-negative-bar-chart-v2/types';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import { generateColor } from '@/shared/lib/charts';
import { ExchangeAmountParams, ExchangeAmountResult } from '@/shared/types';
import { TransactionType } from '@prisma/client';

/**
 * Properly organizes partners into a hierarchical structure
 * @param partners Flat array of partners from API
 * @returns Restructured array with proper parent-child relationships
 */
const organizePartnerHierarchy = (partners: Partner[]): Partner[] => {
  // Guard clause: return empty array if partners is not a valid array
  if (!partners || !Array.isArray(partners) || partners.length === 0) {
    return [];
  }

  // Create a map for quick partner lookup by ID
  const partnerMap = new Map<string, Partner>();

  // First pass: add all partners to the map
  partners.forEach((partner) => {
    // Create a clean copy with empty children array
    const cleanPartner = { ...partner, children: [] };
    partnerMap.set(partner.id, cleanPartner);
  });

  // Second pass: build the hierarchy
  const rootPartners: Partner[] = [];

  partners.forEach((partner) => {
    const mappedPartner = partnerMap.get(partner.id);

    if (partner.parentId && partnerMap.has(partner.parentId)) {
      // This is a child partner, add it to its parent's children array
      const parent = partnerMap.get(partner.parentId);
      if (parent && mappedPartner) {
        parent.children.push(mappedPartner);
      }
    } else {
      // This is a root partner (no parent or parent not in our data)
      if (mappedPartner) {
        rootPartners.push(mappedPartner);
      }
    }
  });

  return rootPartners;
};

/**
 * Recursively maps a Partner object to a TwoSideBarItem, including its own transactions
 * and those of its descendants.
 * @param partner The Partner object to map
 * @param currency The current currency setting
 * @returns A TwoSideBarItem representing the partner and its children
 */
const mapPartnerToTwoSideBarItem = (
  partner: Partner,
  currency: string,
  getExchangeAmount: (params: ExchangeAmountParams) => ExchangeAmountResult,
): TwoSideBarItem => {
  // Recursively map children
  const childrenItems = (partner.children || []).map((child) =>
    mapPartnerToTwoSideBarItem(child, currency, getExchangeAmount),
  );

  // Calculate the partner's own positive and negative values from its transactions
  let ownPositive = 0;
  let ownNegative = 0;

  (partner.transactions || []).forEach((tx) => {
    if (!tx.isDeleted) {
      const baseAmount = parseFloat(String(tx?.baseAmount));
      // Only include non-deleted transactions
      if (tx.type === TransactionType.Income) {
        ownPositive += baseAmount;
      } else if (tx.type === TransactionType.Expense) {
        ownNegative -= baseAmount;
      }
    }
  });

  // Convert values based on currency
  const convertedPositive = getExchangeAmount({
    amount: ownPositive,
    fromCurrency: partner?.transactions?.[0]?.baseCurrency || 'USD',
    toCurrency: currency,
  }).convertedAmount;

  const convertedNegative = getExchangeAmount({
    amount: ownNegative,
    fromCurrency: partner?.transactions?.[0]?.baseCurrency || 'USD',
    toCurrency: currency,
  }).convertedAmount;

  // Total values include own transactions plus children's totals
  const totalPositive =
    convertedPositive + childrenItems.reduce((sum, child) => sum + child.positiveValue, 0);
  const totalNegative =
    convertedNegative + childrenItems.reduce((sum, child) => sum + child.negativeValue, 0);
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
 * @param currency The current currency setting
 * @returns Array of TwoSideBarItem objects for the chart
 */
export const mapPartnersToTwoSideBarItems = (
  data: Partner[],
  currency: string,
  getExchangeAmount: (params: ExchangeAmountParams) => ExchangeAmountResult,
): TwoSideBarItem[] => {
  // Guard clause: return empty array if data is not a valid array
  if (!data || !Array.isArray(data)) {
    return [];
  }

  // Organize partners into proper hierarchy first
  const rootPartners = organizePartnerHierarchy(data);

  // Then map the properly structured data to chart items
  return rootPartners.map((partner) =>
    mapPartnerToTwoSideBarItem(partner, currency, getExchangeAmount),
  );
};
