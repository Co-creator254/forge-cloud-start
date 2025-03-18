
import { simulateDelay } from './apiUtils';

interface AmisKePriceData {
  id: string;
  commodity: string;
  market: string;
  price: number;
  unit: string;
  date: string;
  county: string;
}

interface AmisKeMarket {
  id: string;
  name: string;
  county: string;
  type: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Fetch market prices from AMIS Kenya
 * Since direct API access might be limited, we would need to scrape and parse the data
 * from the website. For now, we're logging the fact that this would require
 * server-side scraping in a production environment.
 */
export const fetchAmisKePrices = async (): Promise<AmisKePriceData[]> => {
  try {
    console.log("AMIS Kenya requires web scraping as they don't provide a public API");
    console.log("In a production system, this would be implemented with a server-side scraper");
    
    // For now, we'll continue with simulated data but with more realistic Kenyan counties
    const kenyanCounties = [
      "Nairobi", "Mombasa", "Nakuru", "Kisumu", "Eldoret", "Kiambu", "Machakos",
      "Kajiado", "Nyeri", "Meru", "Kakamega", "Kisii", "Bungoma", "Embu", "Murang'a"
    ];
    
    const commodities = ["Maize", "Beans", "Rice", "Potatoes", "Tomatoes", "Onions", "Cabbage"];
    const markets = ["Wakulima Market", "Kongowea Market", "Nakuru Main Market", "Kibuye Market", "Eldoret Main Market"];
    
    // Generate more realistic data for multiple counties
    const prices: AmisKePriceData[] = [];
    
    // Generate 30 price entries across different markets and commodities
    for (let i = 0; i < 30; i++) {
      const countyIndex = Math.floor(Math.random() * kenyanCounties.length);
      const commodityIndex = Math.floor(Math.random() * commodities.length);
      const marketIndex = Math.floor(Math.random() * markets.length);
      
      // More realistic base prices based on commodity
      const basePriceMap: Record<string, number> = {
        "Maize": 50,
        "Beans": 120,
        "Rice": 130,
        "Potatoes": 40,
        "Tomatoes": 80,
        "Onions": 100,
        "Cabbage": 60
      };
      
      const commodity = commodities[commodityIndex];
      const basePrice = basePriceMap[commodity] || 50;
      
      // Add some variation to prices
      const priceVariation = 0.8 + (Math.random() * 0.4); // 80% to 120% of base price
      
      prices.push({
        id: `price-${i+1}`,
        commodity,
        market: markets[marketIndex],
        price: Math.round(basePrice * priceVariation),
        unit: "Kg",
        date: new Date().toISOString().split('T')[0],
        county: kenyanCounties[countyIndex]
      });
    }
    
    console.log("Generated AMIS Kenya prices (simulated):", prices);
    return prices;
  } catch (error) {
    console.error("Error fetching AMIS Kenya prices:", error);
    return [];
  }
};

/**
 * Fetch markets information from AMIS Kenya
 */
export const fetchAmisKeMarkets = async (): Promise<AmisKeMarket[]> => {
  try {
    console.log("AMIS Kenya markets would require web scraping in a production environment");
    
    // More comprehensive list of Kenyan markets
    const markets = [
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
    
    console.log("Generated AMIS Kenya markets (simulated):", markets);
    return markets;
  } catch (error) {
    console.error("Error fetching AMIS Kenya markets:", error);
    return [];
  }
};

/**
 * Get price history for a commodity across all markets
 * @param commodity The commodity to get price history for
 */
export const getAmisKePriceHistory = async (commodity: string): Promise<any[]> => {
  try {
    // In a real implementation, you would fetch historical data
    // For now, we'll generate simulated data
    await simulateDelay(1200);
    
    const today = new Date();
    const data = [];
    
    // Generate 30 days of price history
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Add some random fluctuation
      const basePrice = commodity === "Maize" ? 50 : 
                        commodity === "Beans" ? 120 :
                        commodity === "Potatoes" ? 35 : 80;
      
      const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(basePrice * randomFactor),
        commodity,
      });
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching price history for ${commodity}:`, error);
    return [];
  }
};
