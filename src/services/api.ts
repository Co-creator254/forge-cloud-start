
// Helper function to simulate API delay
const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

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
