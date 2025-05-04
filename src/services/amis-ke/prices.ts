
import { AmisKePriceData, AmisKeMarket } from './types';

const API_BASE_URL = "https://amis.kilimo.go.ke/en/api";

/**
 * Fetch market prices from AMIS Kenya
 */
export const fetchAmisKePrices = async (): Promise<AmisKePriceData[]> => {
  console.log("Fetching real pricing data from Ministry of Agriculture API");
  
  // Make an actual API call to the Ministry's endpoint
  const response = await fetch(`${API_BASE_URL}/commodity-prices/`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  });
  
  if (!response.ok) {
    console.error(`API error: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log("Received real commodity price data:", data);
  
  // Transform the API response to match our expected format
  const prices: AmisKePriceData[] = data.results.map((item: any) => ({
    id: item.id.toString(),
    commodity: item.commodity_name,
    market: item.market_name,
    price: parseFloat(item.price),
    unit: item.unit || "Kg",
    date: item.date_recorded || new Date().toISOString().split('T')[0],
    county: item.county_name
  }));
  
  console.log(`Successfully fetched ${prices.length} real price records from Ministry API`);
  return prices;
};

/**
 * Fetch markets information from AMIS Kenya
 */
export const fetchAmisKeMarkets = async (): Promise<AmisKeMarket[]> => {
  console.log("Fetching real market data from Ministry of Agriculture API");
  
  // Make an actual API call to the Ministry's endpoint for markets
  const response = await fetch(`${API_BASE_URL}/markets/`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  });
  
  if (!response.ok) {
    console.error(`API error: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch market data: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log("Received real market data:", data);
  
  // Transform the API response to match our expected format
  const marketsData: AmisKeMarket[] = data.results.map((item: any) => ({
    id: item.id.toString(),
    name: item.name,
    county: item.county_name,
    type: item.market_type || "N/A",
    coordinates: item.latitude && item.longitude ? {
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude)
    } : undefined
  }));
  
  console.log(`Successfully fetched ${marketsData.length} real market records from Ministry API`);
  return marketsData;
};

/**
 * Get price history for a commodity across all markets
 * @param commodity The commodity to get price history for
 */
export const getAmisKePriceHistory = async (commodity: string): Promise<any[]> => {
  console.log(`Fetching real price history data for ${commodity} from Ministry API`);
  
  // Encode the commodity name for URL use
  const encodedCommodity = encodeURIComponent(commodity);
  
  // Make an actual API call to the Ministry's endpoint for price history
  const response = await fetch(`${API_BASE_URL}/price-history/?commodity=${encodedCommodity}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    mode: 'cors'
  });
  
  if (!response.ok) {
    console.error(`API error: ${response.status} ${response.statusText}`);
    throw new Error(`Failed to fetch price history: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log(`Received real price history data for ${commodity}:`, data);
  
  // Transform the API response to match our expected format
  const historyData = data.results.map((item: any) => ({
    date: item.date_recorded,
    price: parseFloat(item.price),
    commodity: item.commodity_name,
    market: item.market_name,
    county: item.county_name
  }));
  
  console.log(`Successfully fetched ${historyData.length} real price history records`);
  return historyData;
};
