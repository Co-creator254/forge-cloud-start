
import { simulateDelay } from '../apiUtils';
import { AmisKePriceData, AmisKeMarket } from './types';
import { 
  kenyaCounties, 
  commodities, 
  markets, 
  basePriceMap, 
  measureUnitMap 
} from './constants';

const API_BASE_URL = "https://amis.kilimo.go.ke/en/api";

/**
 * Fetch market prices from AMIS Kenya
 * Instead of simulated data, we now fetch from the actual Ministry of Agriculture API
 */
export const fetchAmisKePrices = async (): Promise<AmisKePriceData[]> => {
  try {
    console.log("Fetching real pricing data from Ministry of Agriculture API");
    
    // Make an actual API call to the Ministry's endpoint
    const response = await fetch(`${API_BASE_URL}/commodity-prices/`);
    
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
  } catch (error) {
    console.error("Error fetching real price data:", error);
    console.warn("Falling back to simulated data due to API error");
    
    // Fallback to simulated data only if the API call fails
    return generateSimulatedPriceData();
  }
};

/**
 * Fetch markets information from AMIS Kenya
 */
export const fetchAmisKeMarkets = async (): Promise<AmisKeMarket[]> => {
  try {
    console.log("Fetching real market data from Ministry of Agriculture API");
    
    // Make an actual API call to the Ministry's endpoint for markets
    const response = await fetch(`${API_BASE_URL}/markets/`);
    
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
  } catch (error) {
    console.error("Error fetching real market data:", error);
    console.warn("Falling back to simulated market data due to API error");
    
    // Fallback to simulated data only if the API call fails
    return generateSimulatedMarketData();
  }
};

/**
 * Get price history for a commodity across all markets
 * @param commodity The commodity to get price history for
 */
export const getAmisKePriceHistory = async (commodity: string): Promise<any[]> => {
  try {
    console.log(`Fetching real price history data for ${commodity} from Ministry API`);
    
    // Encode the commodity name for URL use
    const encodedCommodity = encodeURIComponent(commodity);
    
    // Make an actual API call to the Ministry's endpoint for price history
    const response = await fetch(`${API_BASE_URL}/price-history/?commodity=${encodedCommodity}`);
    
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
  } catch (error) {
    console.error(`Error fetching real price history for ${commodity}:`, error);
    console.warn("Falling back to simulated price history data due to API error");
    
    // Fallback to simulated data only if the API call fails
    return generateSimulatedPriceHistory(commodity);
  }
};

// Fallback functions that generate simulated data only when real API fails

const generateSimulatedPriceData = (): AmisKePriceData[] => {
  console.log("FALLBACK: Generating simulated price data as API call failed");
  const prices: AmisKePriceData[] = [];
  
  kenyaCounties.forEach(county => {
    const countyItemCount = 5 + Math.floor(Math.random() * 6);
    const countyMarket = markets[Math.floor(Math.random() * markets.length)];
    
    const shuffledCommodities = [...commodities].sort(() => 0.5 - Math.random());
    const selectedCommodities = shuffledCommodities.slice(0, countyItemCount);
    
    selectedCommodities.forEach(commodity => {
      const basePrice = basePriceMap[commodity] || 50;
      let regionalFactor = 1.0;
      
      if (["Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu"].includes(county)) {
        regionalFactor = 1.1;
      } else if (["Nairobi", "Kiambu", "Machakos", "Kajiado"].includes(county)) {
        regionalFactor = 1.2;
      } else if (["Turkana", "Marsabit", "Wajir", "Mandera"].includes(county)) {
        regionalFactor = 1.3;
      }
      
      const priceVariation = 0.8 + (Math.random() * 0.4);
      const finalPrice = Math.round(basePrice * regionalFactor * priceVariation);
      const unit = measureUnitMap[commodity] || "Kg";
      
      prices.push({
        id: `${county}-${commodity}`.toLowerCase().replace(/\s+/g, '-'),
        commodity,
        market: countyMarket,
        price: finalPrice,
        unit,
        date: new Date().toISOString().split('T')[0],
        county
      });
    });
  });
  
  return prices;
};

const generateSimulatedMarketData = (): AmisKeMarket[] => {
  console.log("FALLBACK: Generating simulated market data as API call failed");
  
  return [
    {
      id: "1",
      name: "Wakulima Market",
      county: "Nairobi",
      type: "Urban",
      coordinates: { lat: -1.2864, lng: 36.8172 }
    },
    {
      id: "2",
      name: "Kongowea Market",
      county: "Mombasa",
      type: "Coastal",
      coordinates: { lat: -4.0435, lng: 39.6682 }
    },
    {
      id: "3",
      name: "Nakuru Main Market",
      county: "Nakuru",
      type: "Urban",
      coordinates: { lat: -0.3031, lng: 36.0800 }
    },
    {
      id: "4",
      name: "Kibuye Market",
      county: "Kisumu",
      type: "Urban",
      coordinates: { lat: -0.1022, lng: 34.7617 }
    },
    {
      id: "5",
      name: "Eldoret Main Market",
      county: "Uasin Gishu",
      type: "Urban",
      coordinates: { lat: 0.5143, lng: 35.2698 }
    },
    {
      id: "6",
      name: "Karatina Market",
      county: "Nyeri",
      type: "Rural",
      coordinates: { lat: -0.4756, lng: 37.1229 }
    },
    {
      id: "7",
      name: "Garissa Livestock Market",
      county: "Garissa",
      type: "Livestock",
      coordinates: { lat: -0.4569, lng: 39.6404 }
    },
    {
      id: "8",
      name: "Kitale Municipal Market",
      county: "Trans Nzoia",
      type: "Urban",
      coordinates: { lat: 1.0157, lng: 35.0023 }
    }
  ];
};

const generateSimulatedPriceHistory = (commodity: string): any[] => {
  console.log(`FALLBACK: Generating simulated price history for ${commodity} as API call failed`);
  
  const today = new Date();
  const data = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const basePrice = commodity === "Maize" ? 50 : 
                      commodity === "Beans" ? 120 :
                      commodity === "Potatoes" ? 35 : 80;
    
    const randomFactor = 0.9 + (Math.random() * 0.2);
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(basePrice * randomFactor),
      commodity,
    });
  }
  
  return data;
};
