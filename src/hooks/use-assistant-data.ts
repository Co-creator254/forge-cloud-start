
import { useState, useEffect } from 'react';
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from '@/features/ai-assistant/types';
import { supabase } from "@/integrations/supabase/client";

interface SupabaseMarketPrice {
  id: string;
  market_id: string;
  market_name: string;
  county: string;
  commodity_name: string;
  price: number;
  unit: string;
  date_recorded: string;
}

interface SupabaseForecast {
  id: string;
  commodity_name: string;
  county: string;
  current_price: number;
  forecast_price: number;
  confidence_level: number;
  period: string;
}

interface AssistantData {
  markets: Market[];
  forecasts: Forecast[];
  warehouses: Warehouse[];
  transporters: Transporter[];
  amisPrices: any[];
  amisMarkets: any[];
}

interface AssistantDataResult {
  data: AssistantData;
  dataLoading: boolean;
  error: string | null;
  isRealData: boolean;
}

// Mock data for fallback when API calls fail
const mockMarkets: Market[] = [
  {
    id: "m1",
    name: "Nairobi Central Market",
    county: "Nairobi",
    location: {
      county: "Nairobi",
      coordinates: { latitude: -1.286389, longitude: 36.817223 }
    },
    producePrices: [
      { id: "p1", produceName: "Maize", price: 45, unit: "kg", date: new Date().toLocaleDateString() },
      { id: "p2", produceName: "Beans", price: 120, unit: "kg", date: new Date().toLocaleDateString() }
    ],
    demand: "High"
  },
  {
    id: "m2",
    name: "Mombasa Municipal Market",
    county: "Mombasa",
    location: {
      county: "Mombasa",
      coordinates: { latitude: -4.043477, longitude: 39.668205 }
    },
    producePrices: [
      { id: "p3", produceName: "Tomatoes", price: 80, unit: "kg", date: new Date().toLocaleDateString() },
      { id: "p4", produceName: "Bananas", price: 15, unit: "piece", date: new Date().toLocaleDateString() }
    ],
    demand: "Medium"
  }
];

const mockForecasts: Forecast[] = [
  {
    id: "f1",
    produceName: "Maize",
    period: "May-August 2023",
    expectedProduction: 120000,
    expectedDemand: 140000,
    confidenceLevel: "high",
    county: "Nakuru",
    unit: "tons"
  },
  {
    id: "f2",
    produceName: "Coffee",
    period: "June-September 2023",
    expectedProduction: 25000,
    expectedDemand: 30000,
    confidenceLevel: "medium",
    county: "Kiambu",
    unit: "tons"
  }
];

export const useAssistantData = (): AssistantDataResult => {
  const [data, setData] = useState<AssistantData>({
    markets: [],
    forecasts: [],
    warehouses: [],
    transporters: [],
    amisPrices: [],
    amisMarkets: [],
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      setError(null);

      try {
        // Fetch market prices from Supabase with timeout
        const marketPricesPromise = Promise.race([
          supabase.from('market_prices').select('*'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Fetch timeout')), 5000)
          )
        ]);

        const forecastsPromise = Promise.race([
          supabase.from('market_forecasts').select('*'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Fetch timeout')), 5000)
          )
        ]);

        const transportersPromise = Promise.race([
          supabase.from('transporters').select('*'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Fetch timeout')), 5000)
          )
        ]);

        // Use Promise.allSettled to handle partial failures
        const [
          marketPricesResult, 
          forecastsResult, 
          transportersResult
        ] = await Promise.allSettled([
          marketPricesPromise,
          forecastsPromise,
          transportersPromise
        ]);

        // Process market prices data
        let markets: Market[] = [];
        if (marketPricesResult.status === 'fulfilled') {
          const { data: marketPricesData, error: marketPricesError } = marketPricesResult.value as any;
          
          if (marketPricesError) {
            console.warn(`Market prices error: ${marketPricesError.message}`);
          } else if (marketPricesData && marketPricesData.length > 0) {
            markets = processMarketPricesData(marketPricesData);
            console.log(`Processed ${markets.length} markets from real data`);
          }
        }

        // If no real data, use mock data
        if (markets.length === 0) {
          console.log('Using mock market data as fallback');
          markets = mockMarkets;
        }

        // Process forecast data
        let forecasts: Forecast[] = [];
        if (forecastsResult.status === 'fulfilled') {
          const { data: forecastsData, error: forecastsError } = forecastsResult.value as any;
          
          if (forecastsError) {
            console.warn(`Forecasts error: ${forecastsError.message}`);
          } else if (forecastsData && forecastsData.length > 0) {
            forecasts = processForecastsData(forecastsData);
            console.log(`Processed ${forecasts.length} forecasts from real data`);
          }
        }

        // If no real forecast data, use mock data
        if (forecasts.length === 0) {
          console.log('Using mock forecast data as fallback');
          forecasts = mockForecasts;
        }

        // Process transporters data
        let transporters: Transporter[] = [];
        if (transportersResult.status === 'fulfilled') {
          const { data: transportersData, error: transportersError } = transportersResult.value as any;
          
          if (transportersError) {
            console.warn(`Transporters error: ${transportersError.message}`);
            // For RLS issues, provide more helpful error info
            if (transportersError.code === '42501') {
              console.warn('Permission denied error. RLS policies may need to be configured.');
            }
          } else if (transportersData && transportersData.length > 0) {
            transporters = processTransportersData(transportersData);
            console.log(`Processed ${transporters.length} transporters from real data`);
          }
        }

        // Update the state with all available data
        setData(prev => ({ 
          ...prev, 
          markets,
          forecasts,
          transporters,
        }));
        
        // Consider data real if we got at least something from the database
        const hasRealData = markets.length > 0 || forecasts.length > 0 || transporters.length > 0;
        setIsRealData(hasRealData);
        
        if (hasRealData) {
          console.log('Successfully loaded real data from Supabase');
        } else {
          setError("Couldn't load data from database. Using fallback data instead.");
        }

      } catch (err: any) {
        console.error("Error fetching data from Supabase:", err);
        setError(err.message || "Failed to load data.");
        
        // Set mock data as fallback
        setData(prev => ({ 
          ...prev, 
          markets: mockMarkets,
          forecasts: mockForecasts,
        }));
        
        setIsRealData(false);
        
        // Implement retry logic (max 3 retries)
        if (retryCount < 3) {
          console.log(`Retrying data fetch (attempt ${retryCount + 1} of 3)...`);
          setRetryCount(retryCount + 1);
          // Retry after a delay
          setTimeout(() => loadData(), 2000);
          return;
        }
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [retryCount]);

  // Process market prices data from Supabase to our app format
  const processMarketPricesData = (data: SupabaseMarketPrice[]): Market[] => {
    const marketMap = new Map<string, Market>();
    
    data.forEach(item => {
      const marketId = item.market_id;
      
      if (!marketMap.has(marketId)) {
        // Create new market
        marketMap.set(marketId, {
          id: marketId,
          name: item.market_name,
          county: item.county,
          location: {
            county: item.county,
            coordinates: undefined // We'll populate this if available
          },
          producePrices: []
        });
      }
      
      // Add produce price to existing market
      const market = marketMap.get(marketId)!;
      market.producePrices.push({
        id: item.id,
        produceName: item.commodity_name,
        price: item.price,
        unit: item.unit,
        date: new Date(item.date_recorded).toLocaleDateString()
      });
    });
    
    return Array.from(marketMap.values());
  };

  // Process forecast data from Supabase to our app format
  const processForecastsData = (data: SupabaseForecast[]): Forecast[] => {
    return data.map(item => {
      return {
        id: item.id,
        produceName: item.commodity_name,
        period: item.period,
        expectedProduction: 0, // This data might not be available in our current schema
        expectedDemand: 0, // This data might not be available in our current schema
        confidenceLevel: item.confidence_level > 0.8 ? 'high' : 
                        item.confidence_level > 0.5 ? 'medium' : 'low',
        county: item.county,
        unit: 'kg' // Default unit if not specified
      };
    });
  };

  // Process transporters data from Supabase to our app format
  const processTransportersData = (data: any[]): Transporter[] => {
    return data.map(item => {
      return {
        id: item.id,
        name: item.name,
        counties: item.counties || [],
        contactInfo: item.contact_info,
        hasRefrigeration: item.has_refrigeration,
        vehicleType: item.vehicle_type,
        loadCapacity: item.load_capacity,
        rates: item.rates,
        serviceType: item.service_type,
        capacity: item.capacity,
        availableTimes: item.available_times || []
      };
    });
  };

  return { data, dataLoading, error, isRealData };
};
