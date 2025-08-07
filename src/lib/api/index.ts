// Export all API modules
export { marketplaceApi } from './marketplace';
export { profilesApi } from './profiles';
export { tradesApi } from './trades';
export { ApiBase, withErrorHandling } from './base';

// Community API
import { ApiBase } from './base';
export const communityApi = new ApiBase('community_posts');

// Group Orders API
export const groupOrdersApi = new ApiBase('group_input_orders');

// Transportation API
export const transportationApi = new ApiBase('transportation_requests');

// Service Providers API
export const serviceProvidersApi = new ApiBase('service_providers');

// Training Events API
export const trainingEventsApi = new ApiBase('training_events');

// Food Rescue API
export const foodRescueApi = new ApiBase('food_rescue_listings');

// Barter Exchange API
export const barterApi = new ApiBase('barter_listings');

// Price Trends API
export const priceTrendsApi = new ApiBase('price_trends');

// Products API
export const productsApi = new ApiBase('products');

// Farms API
export const farmsApi = new ApiBase('farms');

// Notifications API
export const notificationsApi = new ApiBase('notifications');