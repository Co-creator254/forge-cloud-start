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

// Supply Chain API - now using enhanced kilimoAPI
export {
  fetchKilimoStats,
  fetchKilimoMarkets as fetchMarkets,
  fetchKilimoFarmers as fetchFarmers,
  fetchKilimoProduce as fetchProduce,
  fetchTransportProviders as fetchLogistics,
  fetchDemandForecasts as fetchForecasts,
  fetchWarehouses,
  fetchFarmerGroups,
  calculateBestMarkets
} from './kilimoAPI';

// Search API functionality
export { fetchData, fetchItemById } from './searchAPI';

// Re-export for Tender API
export { fetchAwardedTenders } from './awardedTendersAPI';

// AmisKe Data API
export { 
  fetchAmisKePrices,
  fetchAmisKeMarkets,
  getAmisKePriceHistory
} from './amis-ke';

// Cron Jobs for data automation
export {
  fetchDailyAmisPrices,
  updateWeeklyKilimoStats,
  archiveMonthlyHistoricalData,
  runAllCronJobs,
  getArchivedData,
  testDataExtraction,
  getAllCommodityPrices
} from './cronJobs';

// Jobs API (to be implemented with real data in the future)
export const fetchJobs = async (filters?: any) => {
  // This is a placeholder that would be replaced with a real API implementation
  const { simulateDelay } = await import('./apiUtils');
  await simulateDelay(800);
  return [];
};
