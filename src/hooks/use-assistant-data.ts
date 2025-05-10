import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from '@/features/ai-assistant/types';

interface SupabaseMarket {
  id: string;
  market_name: string;
  county: string;
  latitude: number;
  longitude: number;
  commodity_name: string;
  price: number;
  unit: string;
  date_recorded: string;
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
  isRealData?: boolean;
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
        // Use real data from Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabase URL and key must be defined in environment variables.');
        }

        // Fetch market data from Supabase
        const marketsResponse = await fetch(`${supabaseUrl}/rest/v1/market_prices?select=*`, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        });

        if (!marketsResponse.ok) {
          throw new Error(`Failed to fetch markets: ${marketsResponse.status} ${marketsResponse.statusText}`);
        }

        const marketsData = await marketsResponse.json();

        // Convert market data from Supabase format to our app format
        const processMarketData = (data: any[]): Market[] => {
          return data.map(item => {
            // Create a properly formatted market object
            return {
              id: item.id || uuidv4(),
              name: item.market_name,
              county: item.county || 'Unknown County',
              location: {
                county: item.county || 'Unknown County',
                coordinates: item.latitude && item.longitude ? {
                  // Convert numbers to numbers (not strings)
                  latitude: Number(item.latitude),
                  longitude: Number(item.longitude)
                } : undefined
              },
              producePrices: [{
                id: uuidv4(),
                produceName: item.commodity_name,
                price: item.price,
                unit: item.unit || 'kg',
                date: new Date(item.date_recorded).toLocaleDateString()
              }]
            };
          });
        };

        const markets = processMarketData(marketsData);

        setData(prev => ({ ...prev, markets: markets }));
        setIsRealData(true);

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

  return { data, dataLoading, error, isRealData };
};
