
// Re-export everything from the individual API modules

// Utils and common functionality
export { 
  getCategoryName, 
  simulateDelay, 
  formatApiUrl,
  validateApiKey 
} from './apiUtils';

// API Documentation
export {
  API_BASE_URL,
  API_ENDPOINTS,
  apiAccessInformation,
  apiRegistrationSteps,
  apiExampleCode
} from './apiDocs';

// Search API
export { fetchData, fetchItemById } from './searchAPI';

// Awarded Tenders API
export { fetchAwardedTenders } from './awardedTendersAPI';

// Kilimo Stats API
export { fetchKilimoStats } from './kilimoAPI';

// Supply Chain API
export {
  fetchFarmers,
  fetchProduce,
  fetchMarkets,
  fetchLogistics,
  fetchForecasts
} from './supplyChainAPI';

