
// Re-export everything from the individual API modules

// Utils and common functionality
export { 
  simulateDelay, 
  formatApiUrl,
  validateApiKey,
  getCategoryName
} from './apiUtils';

// API Documentation
export {
  API_BASE_URL,
  API_ENDPOINTS,
  apiAccessInformation,
  apiRegistrationSteps,
  apiExampleCode
} from './apiDocs';

// Supply Chain API
export {
  fetchFarmers,
  fetchProduce,
  fetchMarkets,
  fetchLogistics,
  fetchForecasts
} from './supplyChainAPI';

// Search API functionality
export { fetchData, fetchItemById } from './searchAPI';

// Re-export for Tender API
export { fetchAwardedTenders } from './awardedTendersAPI';

// Kilimo Stats API
export { fetchKilimoStats } from './kilimoAPI';

// AmisKe Data API
export { 
  fetchAmisKePrices,
  fetchAmisKeMarkets,
  getAmisKePriceHistory
} from './amisKeIntegration';

// Cron Jobs for data automation
export {
  fetchDailyAmisPrices,
  updateWeeklyKilimoStats,
  archiveMonthlyHistoricalData,
  runAllCronJobs,
  getArchivedData,
  testDataExtraction
} from './cronJobs';

// Jobs API (to be implemented with real data in the future)
export const fetchJobs = async (filters?: any) => {
  // This is a placeholder that would be replaced with a real API implementation
  const { simulateDelay } = await import('./apiUtils');
  await simulateDelay(800);
  return [];
};
