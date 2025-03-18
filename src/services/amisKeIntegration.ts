
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
 * Since direct API access might be limited, we'll scrape and parse the data
 */
export const fetchAmisKePrices = async (): Promise<AmisKePriceData[]> => {
  try {
    // In a real implementation, you would parse the HTML from amis.co.ke
    // For now, we'll simulate the data
    await simulateDelay(1000);
    
    // This is simulated data based on AMIS Kenya structure
    return [
      {
        id: "1",
        commodity: "Maize",
        market: "Wakulima Market",
        price: 50,
        unit: "Kg",
        date: new Date().toISOString().split('T')[0],
        county: "Nairobi",
      },
      {
        id: "2",
        commodity: "Beans",
        market: "Wakulima Market",
        price: 120,
        unit: "Kg",
        date: new Date().toISOString().split('T')[0],
        county: "Nairobi",
      },
      {
        id: "3",
        commodity: "Potatoes",
        market: "Nakuru Market",
        price: 35,
        unit: "Kg",
        date: new Date().toISOString().split('T')[0],
        county: "Nakuru",
      },
    ];
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
    // In a real implementation, you would extract this from the AMIS Kenya website
    await simulateDelay(800);
    
    return [
      {
        id: "1",
        name: "Wakulima Market",
        county: "Nairobi",
        type: "Urban",
        coordinates: {
          lat: -1.2864,
          lng: 36.8172,
        },
      },
      {
        id: "2",
        name: "Nakuru Market",
        county: "Nakuru",
        type: "Urban",
        coordinates: {
          lat: -0.3031,
          lng: 36.0800,
        },
      },
      {
        id: "3",
        name: "Mombasa Market",
        county: "Mombasa",
        type: "Coastal",
        coordinates: {
          lat: -4.0435,
          lng: 39.6682,
        },
      },
    ];
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
