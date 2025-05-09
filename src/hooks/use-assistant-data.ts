
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from '@/features/ai-assistant/types';
import { AmisKeApiHandler } from '@/services/amis-ke/api-handler';
import { AssistantDataResult } from '@/types/assistant';
import { 
  fetchRealMarketPrices, 
  fetchRealMarketForecasts, 
  convertToMarketFormat, 
  convertToForecastFormat,
  syncAmisDataToDatabase
} from '@/services/marketDataService';

// Mock data for fallbacks
import { mockMarkets, mockForecasts, mockWarehouses, mockTransporters } from '@/features/ai-assistant/mockData';

export function useAssistantData(): AssistantDataResult {
  const { toast } = useToast();
  const [data, setData] = useState({
    markets: [] as Market[],
    forecasts: [] as Forecast[],
    warehouses: [] as Warehouse[],
    transporters: [] as Transporter[],
    amisPrices: [] as any[],
    amisMarkets: [] as any[]
  });
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usedRealData, setUsedRealData] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchAllData = async () => {
      setDataLoading(true);
      setError(null);
      
      try {
        // Try to fetch real data from our Supabase database first
        const [marketPrices, marketForecasts] = await Promise.all([
          fetchRealMarketPrices(),
          fetchRealMarketForecasts()
        ]);
        
        let markets: Market[] = [];
        let forecasts: Forecast[] = [];
        let usedReal = false;
        
        // If we have real market prices in the database
        if (marketPrices.length > 0) {
          markets = convertToMarketFormat(marketPrices);
          usedReal = true;
        }
        
        // If we have real forecasts in the database
        if (marketForecasts.length > 0) {
          forecasts = convertToForecastFormat(marketForecasts);
          usedReal = true;
        }
        
        // If we don't have data in Supabase yet, try AMIS Kenya API directly
        if (markets.length === 0) {
          const [amisPricesResponse, amisMarketsResponse] = await Promise.allSettled([
            AmisKeApiHandler.get('prices', { limit: 50 }),
            AmisKeApiHandler.get('markets', { limit: 20 })
          ]);
          
          let amisPrices: any[] = [];
          let amisMarkets: any[] = [];
          
          if (amisPricesResponse.status === 'fulfilled' && amisPricesResponse.value?.results) {
            amisPrices = amisPricesResponse.value.results;
          }
          
          if (amisMarketsResponse.status === 'fulfilled' && amisMarketsResponse.value?.results) {
            amisMarkets = amisMarketsResponse.value.results;
          }
          
          // Map AMIS data to our Market model
          const marketsFromAmis: Market[] = amisMarkets.slice(0, 5).map(market => ({
            id: String(market.id) || `market-${Date.now()}-${Math.random()}`,
            name: market.name || 'Unknown Market',
            county: market.county || 'Unknown County',
            location: {
              county: market.county || 'Unknown County',
              coordinates: market.coordinates || { latitude: 0, longitude: 0 }
            },
            producePrices: amisPrices
              .filter(price => price.market_id === market.id)
              .map(price => ({
                id: String(price.id) || `price-${Date.now()}-${Math.random()}`,
                produceName: price.commodity_name || 'Unknown Commodity',
                price: price.price || 0,
                unit: price.unit || 'kg'
              }))
          }));
          
          if (marketsFromAmis.length > 0) {
            markets = marketsFromAmis;
            usedReal = true;
            
            // Save AMIS data to our database for future use
            syncAmisDataToDatabase().catch(err => {
              console.error("Error syncing AMIS data to database:", err);
            });
          }
        }

        if (isMounted) {
          setData({
            // Use real data if available, otherwise fallback to mock data
            markets: markets.length > 0 ? markets : mockMarkets,
            forecasts: forecasts.length > 0 ? forecasts : mockForecasts,
            warehouses: mockWarehouses, // Replace with real warehouse API when available
            transporters: mockTransporters, // Replace with real transporter API when available
            amisPrices: [],
            amisMarkets: []
          });
          
          setUsedRealData(usedReal);
          
          // Show toast only if we used real data
          if (usedReal) {
            toast({
              title: "Real Market Data",
              description: "Using real market data for agricultural insights",
              variant: "default"
            });
          } else {
            toast({
              title: "Using Backup Data",
              description: "Could not connect to data sources. Using backup data.",
              variant: "destructive"
            });
          }
        }
      } catch (err) {
        console.error('Error fetching assistant data:', err);
        
        if (isMounted) {
          setError('Failed to load market data. Using cached data for now.');
          
          // Fallback to mock data
          setData({
            markets: mockMarkets,
            forecasts: mockForecasts,
            warehouses: mockWarehouses,
            transporters: mockTransporters,
            amisPrices: [],
            amisMarkets: []
          });
          
          toast({
            title: "Connection Error",
            description: "Unable to fetch agricultural data. Using fallback data.",
            variant: "destructive"
          });
        }
      } finally {
        if (isMounted) {
          setDataLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  return { 
    data, 
    dataLoading, 
    error, 
    isRealData: usedRealData 
  };
}
