
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
    console.log("Fetched Kilimo data:", data);
    
    // Extract counties from the data
    const counties = data.county || [];
    const subsectors = data.subsector || [];
    const domains = data.domain || [];
    const domainElements = data.domainelement || [];

    // Process the Kilimo API structure to extract useful data
    // This will be county information, subsectors, domains, and domain elements
    const processedStats: KilimoStats[] = [];
    
    // Process counties
    counties.forEach((county: any) => {
      processedStats.push({
        id: `county-${county.id}`,
        name: county.name,
        // Ensure value is a number - convert string to number or use 0 as default
        value: parseInt(county.code || '0', 10) || 0,
        // Ensure year is a number
        year: new Date().getFullYear(),
        county: county.name,
        category: 'County',
        unit: 'code',
      });
    });
    
    // Process subsectors and domains for more data points
    subsectors.forEach((subsector: any) => {
      processedStats.push({
        id: `subsector-${subsector.id}`,
        name: subsector.name,
        // Ensure value is a number - default to 0
        value: 0,
        // Ensure year is a number
        year: new Date().getFullYear(),
        county: 'National',
        category: 'Agricultural Subsector',
        unit: subsector.codingsystem || '',
      });
    });
    
    // Add domain elements which represent specific agricultural statistics
    domainElements.forEach((element: any) => {
      // Find the parent domain
      const parentDomain = domains.find((d: any) => d.id === element.domain);
      const domainCategory = parentDomain ? parentDomain.display_name : 'Unknown';
      
      processedStats.push({
        id: `element-${element.id}`,
        name: element.display_name,
        // Ensure value is a number - default to 0
        value: 0,
        // Ensure year is a number
        year: new Date().getFullYear(),
        county: 'National', // Most statistics are national
        category: domainCategory,
        unit: element.codingsystem || '',
      });
    });
    
    console.log(`Processed ${processedStats.length} Kilimo statistics`);
    return processedStats;
  } catch (error) {
    console.error("Error fetching Kilimo stats:", error);
    return [];
  }
};
