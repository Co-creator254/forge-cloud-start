
// We only need to update the getCategoryName function

import { Category, SOLUTION_CATEGORIES } from '@/types';

/**
 * Simulates a network delay for API calls
 * @param ms Milliseconds to delay
 * @returns A promise that resolves after the specified delay
 */
export const simulateDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Returns a human-readable name for a category
 * @param category The category to get the name for
 * @returns The human-readable name for the category
 */
export const getCategoryName = (category: Category): string => {
  switch (category) {
    case 'agriculture':
      return 'Agricultural Issues';
    case 'tender':
      return 'Tender Opportunities';
    case 'solutions':
      return 'Agricultural Solutions';
    case 'awarded-tender':
      return 'Awarded Tenders';
    default:
      return category;
  }
};
