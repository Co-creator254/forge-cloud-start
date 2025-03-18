
import { KilimoStats } from '@/types';
import { simulateDelay } from './apiUtils';

/**
 * Fetch and transform data from the Kilimo statistics API
 * @returns Transformed Kilimo statistics
 */
export const fetchKilimoStats = async (): Promise<KilimoStats[]> => {
  try {
    const response = await fetch("https://statistics.kilimo.go.ke/en/api/apputils/?format=api");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Kilimo stats: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.id || Math.random().toString(36).substring(2, 9),
      name: item.name || '',
      value: parseFloat(item.value) || 0,
      year: parseInt(item.year) || new Date().getFullYear(),
      county: item.county || '',
      category: item.category || '',
      unit: item.unit || '',
    }));
  } catch (error) {
    console.error("Error fetching Kilimo stats:", error);
    return [];
  }
};

/**
 * Transform raw Kilimo data into a format usable for charts
 * @param data Raw Kilimo statistics
 * @param groupBy Property to group by (e.g., 'year', 'county', 'category')
 * @returns Grouped data for visualization
 */
export const transformKilimoDataForCharts = (data: KilimoStats[], groupBy: 'year' | 'county' | 'category' = 'year') => {
  const grouped = data.reduce((acc, curr) => {
    const key = curr[groupBy]?.toString() || 'Unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, KilimoStats[]>);
  
  return grouped;
};

/**
 * Get unique categories from Kilimo data
 * @param data Kilimo statistics
 * @returns Array of unique categories
 */
export const getKilimoCategories = (data: KilimoStats[]): string[] => {
  const categories = new Set<string>();
  data.forEach(item => {
    if (item.category) {
      categories.add(item.category);
    }
  });
  return Array.from(categories);
};

/**
 * Get unique counties from Kilimo data
 * @param data Kilimo statistics
 * @returns Array of unique counties
 */
export const getKilimoCounties = (data: KilimoStats[]): string[] => {
  const counties = new Set<string>();
  data.forEach(item => {
    if (item.county) {
      counties.add(item.county);
    }
  });
  return Array.from(counties);
};
