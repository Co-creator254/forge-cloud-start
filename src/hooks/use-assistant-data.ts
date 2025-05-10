
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

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      setError(null);

      try {
        // Fetch market prices from Supabase
        const { data: marketPricesData, error: marketPricesError } = await supabase
          .from('market_prices')
          .select('*');

        if (marketPricesError) {
          throw new Error(`Failed to fetch market prices: ${marketPricesError.message}`);
        }

        // Fetch market forecasts from Supabase
        const { data: forecastsData, error: forecastsError } = await supabase
          .from('market_forecasts')
          .select('*');

        if (forecastsError) {
          throw new Error(`Failed to fetch market forecasts: ${forecastsError.message}`);
        }

        // Fetch transporters from Supabase
        const { data: transportersData, error: transportersError } = await supabase
          .from('transporters')
          .select('*');

        if (transportersError) {
          throw new Error(`Failed to fetch transporters: ${transportersError.message}`);
        }

        // Process market prices data
        const markets = processMarketPricesData(marketPricesData || []);
        
        // Process forecast data
        const forecasts = processForecastsData(forecastsData || []);
        
        // Process transporters data
        const transporters = processTransportersData(transportersData || []);

        setData(prev => ({ 
          ...prev, 
          markets,
          forecasts,
          transporters,
        }));
        
        setIsRealData(true);
        console.log('Successfully loaded real data from Supabase');

      } catch (err: any) {
        console.error("Error fetching data from Supabase:", err);
        setError(err.message || "Failed to load data.");
        setIsRealData(false);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, []);

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
