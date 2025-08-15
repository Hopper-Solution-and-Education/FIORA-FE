import { BarItem } from '@/components/common/charts/positive-negative-bar-chart/type';
import { Account } from '@/features/home/module/account/slices/types';
import { generateColor } from '@/shared/lib/charts';

/**
 * Builds a hierarchical structure from a flat list of accounts based on parentId.
 * @param flatAccounts Array of Account objects from the server
 * @returns Array of top-level Account objects with children populated
 */
const buildAccountHierarchy = (flatAccounts: Account[]): Account[] => {
  // Create a map of accounts by ID for easy lookup
  const accountMap: { [id: string]: Account } = {};
  flatAccounts.forEach((account) => {
    accountMap[account.id] = { ...account, children: [] };
  });

  // Array to hold top-level accounts (those without a parent)
  const topLevelAccounts: Account[] = [];

  // Assign children to their parents and collect top-level accounts
  flatAccounts.forEach((account) => {
    if (account.parentId && accountMap[account.parentId]) {
      accountMap[account.parentId].children!.push(accountMap[account.id]);
    } else {
      topLevelAccounts.push(accountMap[account.id]);
    }
  });

  return topLevelAccounts;
};

/**
 * Recursively maps an Account object to a BarItem, including its children,
 * with the value representing the sum of its own balance and its children's balances.
 * @param account The Account object to map
 * @param targetCurrency The current currency setting
 * @returns A BarItem representing the account and its children
 */
const mapAccountToBarItem = (
  account: Account,
  targetCurrency: string,
  getExchangeRate: (fromCurrency: string, toCurrency: string) => number | null,
): BarItem => {
  // Recursively map children
  const childrenItems =
    account.children?.map((child) => mapAccountToBarItem(child, targetCurrency, getExchangeRate)) ||
    [];
  const childrenTotalBalance = childrenItems.reduce((sum, child) => sum + child.value, 0);

  // Calculate the total value: own balance + sum of children's values
  const ownBalance = Number(account.baseAmount) || 0;
  const totalValue = ownBalance + childrenTotalBalance;
  const isChild = !!account.parentId;

  // Convert value based on currency
  const convertedValue =
    Number((getExchangeRate(account.baseCurrency, targetCurrency) || 1).toFixed(2)) * totalValue;

  return {
    id: account.id,
    name: account.name,
    icon: account.icon,
    value: convertedValue,
    type: account.type,
    color: generateColor(totalValue, isChild),
    children: childrenItems,
  };
};

/**
 * Maps server response account data to an array of BarItem objects for the chart.
 * @param accounts Array of Account objects from the server response
 * @param currency The current currency setting
 * @returns Array of BarItem objects representing the account hierarchy
 */
export const mapAccountsToBarItems = (
  accounts: Account[],
  currency: string,
  getExchangeRate: (fromCurrency: string, toCurrency: string) => number | null,
): BarItem[] => {
  // Add defensive check to ensure accounts is an array
  if (!Array.isArray(accounts)) {
    console.warn('mapAccountsToBarItems: accounts is not an array, returning empty array');
    return [];
  }

  // Build hierarchy from flat list
  const hierarchicalAccounts = buildAccountHierarchy(accounts);
  // Map top-level accounts to BarItems, including their children
  return hierarchicalAccounts.map((account) =>
    mapAccountToBarItem(account, currency, getExchangeRate),
  );
};
