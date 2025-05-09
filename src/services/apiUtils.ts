
// Utility functions for API operations
import { Category } from '@/types';

// Simulate network delay for demo purposes
export const simulateDelay = async (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Format API URL with parameters
export const formatApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${API_BASE_URL}${endpoint}`;
  if (params && Object.keys(params).length > 0) {
    url += '?' + new URLSearchParams(params).toString();
  }
  return url;
};

// Get human-readable category name
export const getCategoryName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'all': 'All Categories',
    'solutions': 'Agricultural Solutions',
    'issues': 'Agricultural Issues',
    'reports': 'Market Reports',
    'tender': 'Active Tenders',
    'awarded-tender': 'Awarded Tenders'
  };

  return categoryMap[category] || 'Unknown Category';
};

// Validate API key
export const validateApiKey = (apiKey: string): boolean => {
  return apiKey && apiKey.length > 32; // Simple validation
};

// API base URL
export const API_BASE_URL = 'https://api.kilimo-connect.com/v1/';
