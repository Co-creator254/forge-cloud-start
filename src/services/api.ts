
// Re-export everything from the individual API modules

// Utils and common functionality
export { getCategoryName, simulateDelay } from './apiUtils';

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
