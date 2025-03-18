
import { simulateDelay } from './apiUtils';
import { fetchAmisKePrices, fetchAmisKeMarkets } from './amisKeIntegration';
import { fetchKilimoStats } from './kilimoIntegration';

// Interfaces for archived data
interface ArchivedData {
  timestamp: string;
  source: 'amisKe' | 'kilimo';
  data: any[];
}

// In-memory storage for archived data (in a real app, this would use a database)
const dataArchive: ArchivedData[] = [];

/**
 * Daily cron job to fetch the latest AMIS Kenya prices
 * In a real implementation, this would be called by a scheduler
 */
export const fetchDailyAmisPrices = async () => {
  console.log('Running daily AMIS Kenya price update...');
  try {
    // Fetch the latest prices
    const latestPrices = await fetchAmisKePrices();
    console.log(`Successfully fetched ${latestPrices.length} price records`);
    
    // In a real implementation, this would save to a database
    // For now, we'll just return the data
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: latestPrices,
      message: `Successfully updated ${latestPrices.length} price records`
    };
  } catch (error) {
    console.error('Error in daily AMIS Kenya price update:', error);
    return {
      success: false,
      timestamp: new Date().toISOString(),
      message: `Failed to update AMIS Kenya prices: ${error}`
    };
  }
};

/**
 * Weekly cron job to update Kilimo statistics
 * In a real implementation, this would be called by a scheduler
 */
export const updateWeeklyKilimoStats = async () => {
  console.log('Running weekly Kilimo statistics update...');
  try {
    // Fetch the latest statistics
    const latestStats = await fetchKilimoStats();
    console.log(`Successfully fetched ${latestStats.length} statistics records`);
    
    // In a real implementation, this would save to a database
    // For now, we'll just return the data
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: latestStats,
      message: `Successfully updated ${latestStats.length} statistics records`
    };
  } catch (error) {
    console.error('Error in weekly Kilimo statistics update:', error);
    return {
      success: false,
      timestamp: new Date().toISOString(),
      message: `Failed to update Kilimo statistics: ${error}`
    };
  }
};

/**
 * Monthly cron job to archive historical data for trend analysis
 * In a real implementation, this would be called by a scheduler
 */
export const archiveMonthlyHistoricalData = async () => {
  console.log('Running monthly historical data archiving...');
  try {
    // Fetch data from both sources
    const [amisPrices, kilimoStats] = await Promise.all([
      fetchAmisKePrices(),
      fetchKilimoStats()
    ]);
    
    // Archive the data (in a real implementation, this would use a database)
    const amisArchive: ArchivedData = {
      timestamp: new Date().toISOString(),
      source: 'amisKe',
      data: amisPrices
    };
    
    const kilimoArchive: ArchivedData = {
      timestamp: new Date().toISOString(),
      source: 'kilimo',
      data: kilimoStats
    };
    
    dataArchive.push(amisArchive, kilimoArchive);
    
    console.log('Successfully archived data from both sources');
    return {
      success: true,
      timestamp: new Date().toISOString(),
      amisRecords: amisPrices.length,
      kilimoRecords: kilimoStats.length,
      message: `Successfully archived ${amisPrices.length} AMIS records and ${kilimoStats.length} Kilimo records`
    };
  } catch (error) {
    console.error('Error in monthly data archiving:', error);
    return {
      success: false,
      timestamp: new Date().toISOString(),
      message: `Failed to archive historical data: ${error}`
    };
  }
};

/**
 * Manual trigger to run all cron jobs immediately
 * This is useful for testing and development
 */
export const runAllCronJobs = async () => {
  console.log('Manually triggering all cron jobs...');
  
  const results = await Promise.all([
    fetchDailyAmisPrices(),
    updateWeeklyKilimoStats(),
    archiveMonthlyHistoricalData()
  ]);
  
  return {
    dailyAmisPrices: results[0],
    weeklyKilimoStats: results[1],
    monthlyArchive: results[2],
    timestamp: new Date().toISOString(),
  };
};

/**
 * Get the latest archived data
 * @param source The data source to retrieve archived data for
 * @param limit The maximum number of records to return
 */
export const getArchivedData = (source?: 'amisKe' | 'kilimo', limit: number = 10): ArchivedData[] => {
  if (source) {
    return dataArchive
      .filter(archive => archive.source === source)
      .slice(-limit);
  }
  
  return dataArchive.slice(-limit);
};

/**
 * Test function to simulate extracting real data from APIs
 * This is a utility function to demonstrate data extraction capabilities
 */
export const testDataExtraction = async () => {
  console.log('Testing data extraction from APIs...');
  
  try {
    // Test AMIS Kenya data extraction
    console.log('Testing AMIS Kenya data extraction...');
    const amisPrices = await fetchAmisKePrices();
    const amisMarkets = await fetchAmisKeMarkets();
    
    // Test Kilimo statistics extraction
    console.log('Testing Kilimo statistics extraction...');
    const kilimoStats = await fetchKilimoStats();
    
    // Create a summary of the extracted data
    const summary = {
      amisKe: {
        prices: {
          count: amisPrices.length,
          commodities: [...new Set(amisPrices.map(p => p.commodity))],
          markets: [...new Set(amisPrices.map(p => p.market))],
          sampleData: amisPrices.slice(0, 2)
        },
        markets: {
          count: amisMarkets.length,
          counties: [...new Set(amisMarkets.map(m => m.county))],
          sampleData: amisMarkets.slice(0, 2)
        }
      },
      kilimo: {
        stats: {
          count: kilimoStats.length,
          categories: [...new Set(kilimoStats.map(s => s.category))].filter(Boolean),
          counties: [...new Set(kilimoStats.map(s => s.county))].filter(Boolean),
          years: [...new Set(kilimoStats.map(s => s.year))].filter(Boolean),
          sampleData: kilimoStats.slice(0, 2)
        }
      }
    };
    
    console.log('Data extraction test completed successfully');
    return {
      success: true,
      timestamp: new Date().toISOString(),
      summary,
      message: 'Successfully extracted and analyzed data from all sources'
    };
  } catch (error) {
    console.error('Error in data extraction test:', error);
    return {
      success: false,
      timestamp: new Date().toISOString(),
      message: `Failed to extract data: ${error}`
    };
  }
};
