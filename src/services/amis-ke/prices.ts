
import { simulateDelay } from '../apiUtils';
import { AmisKePriceData, AmisKeMarket } from './types';
import { 
  kenyaCounties, 
  commodities, 
  markets, 
  basePriceMap, 
  measureUnitMap 
} from './constants';

/**
 * Fetch market prices from AMIS Kenya
 * Since direct API access might be limited, we would need to scrape and parse the data
 * from the website. For now, we're generating more comprehensive data for all counties.
 */
export const fetchAmisKePrices = async (): Promise<AmisKePriceData[]> => {
  try {
    console.log("AMIS Kenya requires web scraping as they don't provide a public API");
    console.log("In a production system, this would be implemented with a server-side scraper");
    
    // Generate realistic data for all 47 counties
    const prices: AmisKePriceData[] = [];
    
    // Generate at least one entry for each county and multiple commodities
    kenyaCounties.forEach(county => {
      // Select 5-10 random commodities for each county
      const countyItemCount = 5 + Math.floor(Math.random() * 6);
      const countyMarket = markets[Math.floor(Math.random() * markets.length)];
      
      const shuffledCommodities = [...commodities].sort(() => 0.5 - Math.random());
      const selectedCommodities = shuffledCommodities.slice(0, countyItemCount);
      
      selectedCommodities.forEach(commodity => {
        const basePrice = basePriceMap[commodity] || 50;
        // Add regional price variations (coastal areas might have different prices than inland)
        let regionalFactor = 1.0;
        
        if (["Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu"].includes(county)) {
          // Coastal regions
          regionalFactor = 1.1; // 10% higher prices
        } else if (["Nairobi", "Kiambu", "Machakos", "Kajiado"].includes(county)) {
          // Urban regions
          regionalFactor = 1.2; // 20% higher prices
        } else if (["Turkana", "Marsabit", "Wajir", "Mandera"].includes(county)) {
          // Northern arid regions
          regionalFactor = 1.3; // 30% higher prices due to scarcity
        }
        
        // Add some random variation to prices
        const priceVariation = 0.8 + (Math.random() * 0.4); // 80% to 120% of base price
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
    
    console.log(`Generated AMIS Kenya prices for all 47 counties with ${prices.length} entries`);
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
    const marketsData = [
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
    
    console.log("Generated AMIS Kenya markets (simulated):", marketsData);
    return marketsData;
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
