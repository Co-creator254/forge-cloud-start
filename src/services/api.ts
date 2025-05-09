
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

// Featured content API
export {
  fetchFeaturedNews,
  fetchFeaturedServices,
  fetchFeaturedProducts,
  submitNewsItem
} from './amis-ke/featured-content';

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

// Service Provider Registration
export const registerServiceProvider = async (serviceProvider: any) => {
  // This would connect to Supabase in a real implementation
  console.log('Registering service provider:', serviceProvider);
  await simulateDelay(1000);
  return { success: true, id: crypto.randomUUID() };
};

// Jobs API (to be implemented with real data in the future)
export const fetchJobs = async (filters?: any) => {
  // This is a placeholder that would be replaced with a real API implementation
  const { simulateDelay } = await import('./apiUtils');
  await simulateDelay(800);
  return [];
};
