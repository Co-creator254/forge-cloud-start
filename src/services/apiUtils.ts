
import { Category } from '@/types';

// Common utility functions
export const getCategoryName = (category: Category): string => {
  switch (category) {
    case 'agriculture':
      return 'Agricultural Issues';
    case 'tender':
      return 'Tender Opportunities';
    case 'supply-chain':
      return 'Supply Chain Jobs';
    case 'awarded-tender':
      return 'Awarded Tenders';
    default:
      return 'Unknown Category';
  }
};

// Utility to simulate network delay (for development/testing)
export const simulateDelay = async (ms: number = 800): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, ms));
};
