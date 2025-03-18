
import { simulateDelay } from './apiUtils';
import { fetchAmisKePrices } from './amisKeIntegration';
import { fetchKilimoStats } from './kilimoIntegration';

// Simulated database for storing data
let archiveDatabase = {
  amisPriceHistory: [] as any[],
  kilimoStatsHistory: [] as any[],
  lastUpdates: {
    amisPrices: '',
    kilimoStats: '',
    archive: ''
  }
};

/**
 * Daily job to fetch latest AMIS Kenya prices
 */
export const fetchDailyAmisPrices = async () => {
  try {
    console.log('Running daily job to fetch AMIS Kenya prices...');
    const startTime = Date.now();
    
    // Fetch latest prices from AMIS Kenya
    const prices = await fetchAmisKePrices();
    
    // Process and store the prices
    const processedPrices = prices.map(price => ({
      ...price,
      fetchDate: new Date().toISOString(),
      processingTime: Date.now() - startTime
    }));
    
    // Store in our simulated database
    // In a real implementation, this would be saved to a persistent database
    archiveDatabase.amisPriceHistory.push(...processedPrices);
    archiveDatabase.lastUpdates.amisPrices = new Date().toISOString();
    
    // Generate a headline from the data
    const randomIndex = Math.floor(Math.random() * prices.length);
    const headline = prices.length > 0 
      ? `Today's ${prices[randomIndex].commodity} prices at ${prices[randomIndex].market} (${prices[randomIndex].county}): KES ${prices[randomIndex].price} per ${prices[randomIndex].unit}`
      : 'No price data available today';
    
    console.log(`AMIS Kenya data fetch completed. Processed ${prices.length} price records.`);
    console.log(`HEADLINE: ${headline}`);
    
    return {
      success: true,
      recordsProcessed: prices.length,
      executionTime: Date.now() - startTime,
      headline,
      lastUpdate: archiveDatabase.lastUpdates.amisPrices
    };
  } catch (error) {
    console.error('Error in daily AMIS Kenya job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdate: archiveDatabase.lastUpdates.amisPrices
    };
  }
};

/**
 * Weekly job to update Kilimo statistics
 */
export const updateWeeklyKilimoStats = async () => {
  try {
    console.log('Running weekly job to update Kilimo statistics...');
    const startTime = Date.now();
    
    // Fetch latest statistics from Kilimo
    const stats = await fetchKilimoStats();
    
    // Process and store the statistics
    const processedStats = stats.map(stat => ({
      ...stat,
      fetchDate: new Date().toISOString(),
      processingTime: Date.now() - startTime
    }));
    
    // Store in our simulated database
    archiveDatabase.kilimoStatsHistory.push(...processedStats);
    archiveDatabase.lastUpdates.kilimoStats = new Date().toISOString();
    
    // Generate a headline from the data
    const categories = [...new Set(stats.map(s => s.category).filter(Boolean))];
    const headline = categories.length > 0 
      ? `Updated ${categories.length} agricultural categories covering ${[...new Set(stats.map(s => s.county))].length} counties`
      : 'No new Kilimo statistics available this week';
    
    console.log(`Kilimo stats update completed. Processed ${stats.length} statistical records.`);
    console.log(`HEADLINE: ${headline}`);
    
    return {
      success: true,
      recordsProcessed: stats.length,
      categoriesUpdated: categories.length,
      executionTime: Date.now() - startTime,
      headline,
      lastUpdate: archiveDatabase.lastUpdates.kilimoStats
    };
  } catch (error) {
    console.error('Error in weekly Kilimo stats job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdate: archiveDatabase.lastUpdates.kilimoStats
    };
  }
};

/**
 * Monthly job to archive historical data for long-term trend analysis
 */
export const archiveMonthlyHistoricalData = async () => {
  try {
    console.log('Running monthly archiving job for historical data...');
    const startTime = Date.now();
    
    // In a real implementation, this would:
    // 1. Aggregate daily/weekly data
    // 2. Compress and optimize for long-term storage
    // 3. Generate trend analysis
    // 4. Store in a data warehouse or analytics database
    
    // Simulate the archiving process
    await simulateDelay(2000);
    
    const amisRecords = archiveDatabase.amisPriceHistory.length;
    const kilimoRecords = archiveDatabase.kilimoStatsHistory.length;
    
    // Update archive timestamp
    archiveDatabase.lastUpdates.archive = new Date().toISOString();
    
    const headline = `Monthly archive complete: Processed ${amisRecords} AMIS Kenya records and ${kilimoRecords} Kilimo statistics for long-term trend analysis`;
    console.log(headline);
    
    return {
      success: true,
      amisRecordsArchived: amisRecords,
      kilimoRecordsArchived: kilimoRecords,
      executionTime: Date.now() - startTime,
      headline,
      lastUpdate: archiveDatabase.lastUpdates.archive
    };
  } catch (error) {
    console.error('Error in monthly archiving job:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdate: archiveDatabase.lastUpdates.archive
    };
  }
};

/**
 * Run all cron jobs in sequence
 */
export const runAllCronJobs = async () => {
  const results = {
    amisJob: await fetchDailyAmisPrices(),
    kilimoJob: await updateWeeklyKilimoStats(),
    archiveJob: await archiveMonthlyHistoricalData()
  };
  
  console.log('All cron jobs completed:', results);
  return results;
};

/**
 * Get archived data for analysis
 */
export const getArchivedData = () => {
  return {
    amisPriceHistory: archiveDatabase.amisPriceHistory,
    kilimoStatsHistory: archiveDatabase.kilimoStatsHistory,
    lastUpdates: archiveDatabase.lastUpdates
  };
};

/**
 * Test data extraction from both services
 */
export const testDataExtraction = async () => {
  console.log('Testing data extraction from Kilimo API and AMIS Kenya...');
  
  try {
    // Test Kilimo Stats API
    console.log('Fetching data from Kilimo API...');
    const kilimoStart = Date.now();
    const kilimoData = await fetchKilimoStats();
    const kilimoTime = Date.now() - kilimoStart;
    
    console.log(`Kilimo API returned ${kilimoData.length} records in ${kilimoTime}ms`);
    console.log('Sample Kilimo data:', kilimoData.slice(0, 2));
    
    // Test AMIS Kenya (which would be a scraper in production)
    console.log('Fetching data from AMIS Kenya...');
    const amisStart = Date.now();
    const amisData = await fetchAmisKePrices();
    const amisTime = Date.now() - amisStart;
    
    console.log(`AMIS Kenya returned ${amisData.length} records in ${amisTime}ms`);
    console.log('Sample AMIS Kenya data:', amisData.slice(0, 2));
    
    return {
      success: true,
      kilimo: {
        recordCount: kilimoData.length,
        executionTime: kilimoTime,
        sample: kilimoData.slice(0, 3)
      },
      amis: {
        recordCount: amisData.length,
        executionTime: amisTime,
        sample: amisData.slice(0, 3)
      }
    };
  } catch (error) {
    console.error('Error during data extraction test:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
