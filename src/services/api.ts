
// Re-export everything from the individual API modules

// Utils and common functionality
export { 
  simulateDelay, 
  formatApiUrl,
  validateApiKey,
  getCategoryName // Added this export that was missing
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
export { fetchData } from './searchAPI';

// Re-export for pre-fetching on index page
export { fetchAwardedTenders } from './awardedTendersAPI';
