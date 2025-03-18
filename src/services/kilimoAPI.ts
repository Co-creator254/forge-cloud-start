
import { KilimoStats } from '@/types';

// Function to fetch Kilimo stats from the real API
export const fetchKilimoStats = async (): Promise<KilimoStats[]> => {
  try {
    // Using the JSON format endpoint as specified
    const response = await fetch("https://statistics.kilimo.go.ke/en/api/apputils/?format=json");
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Kilimo stats: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Fetched Kilimo data:", data); // Log the structure to understand the API
    
    // Transform the data into our application format
    // This mapping might need adjustment based on the actual API response structure
    return Array.isArray(data) ? data.map((item: any) => ({
      id: item.id || Math.random().toString(36).substring(2, 9),
      name: item.name || item.crop_name || item.commodity || '',
      value: parseFloat(item.value || item.price || item.amount || 0),
      year: parseInt(item.year || item.date_year || new Date().getFullYear()),
      county: item.county || item.location || '',
      category: item.category || item.crop_type || item.commodity_type || '',
      unit: item.unit || item.measure || '',
      date: item.date || new Date().toISOString().split('T')[0],
    })) : [];
  } catch (error) {
    console.error("Error fetching Kilimo stats:", error);
    return [];
  }
};
