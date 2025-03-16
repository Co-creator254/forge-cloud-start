
import { KilimoStats } from '@/types';

// Function to fetch Kilimo stats
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
