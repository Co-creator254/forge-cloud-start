
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

/**
 * Generates a proper API URL for external applications to use
 * @param endpoint The API endpoint to call
 * @param params Optional query parameters
 * @returns A formatted URL string for the API call
 */
export const formatApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  const baseUrl = 'https://api.agritender.co.ke/v1';
  let url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  if (params && Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};

/**
 * Helper function to validate API keys for external applications
 * @param apiKey The API key to validate
 * @returns Boolean indicating if the API key is valid
 */
export const validateApiKey = (apiKey: string): boolean => {
  // In a real implementation, this would verify the API key against a database
  // For this demo, we'll just check if it's a non-empty string with at least 32 characters
  return typeof apiKey === 'string' && apiKey.length >= 32;
};

