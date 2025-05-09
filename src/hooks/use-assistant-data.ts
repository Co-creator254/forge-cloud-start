
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from '@/features/ai-assistant/types';
import { AmisKeApiHandler } from '@/services/amis-ke/api-handler';
import { AssistantDataResult } from '@/types/assistant';

// Mock data for initial loading and fallbacks
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

  useEffect(() => {
    let isMounted = true;
    
    const fetchAllData = async () => {
      setDataLoading(true);
      setError(null);
      
      try {
        // Try to fetch real data from API endpoints
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
        
        // Map AMIS data to our Market model (simplified for illustration)
        const marketsFromAmis: Market[] = amisMarkets.slice(0, 5).map(market => ({
          id: market.id || `market-${Date.now()}-${Math.random()}`,
          name: market.name || 'Unknown Market',
          county: market.county || 'Unknown County',
          location: {
            county: market.county || 'Unknown County',
            coordinates: market.coordinates || { latitude: 0, longitude: 0 }
          },
          producePrices: amisPrices
            .filter(price => price.market_id === market.id)
            .map(price => ({
              id: price.id || `price-${Date.now()}-${Math.random()}`,
              produceName: price.commodity_name || 'Unknown Commodity',
              price: price.price || 0,
              unit: price.unit || 'kg'
            }))
        }));

        if (isMounted) {
          setData({
            // Use real data if available, otherwise fallback to mock data
            markets: marketsFromAmis.length > 0 ? marketsFromAmis : mockMarkets,
            forecasts: mockForecasts, // Replace with real forecast API when available
            warehouses: mockWarehouses, // Replace with real warehouse API when available
            transporters: mockTransporters, // Replace with real transporter API when available
            amisPrices,
            amisMarkets
          });
        }
      } catch (err) {
        console.error('Error fetching assistant data:', err);
        
        if (isMounted) {
          setError('Failed to load some market data. Using cached data for now.');
          
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
            description: "Unable to connect to AMIS Kenya API. Using cached data.",
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

  return { data, dataLoading, error };
}
