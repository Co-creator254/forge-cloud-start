
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePerformance } from '@/hooks/use-performance';
import { 
  fetchMarkets, 
  fetchForecasts, 
  fetchWarehouses,
  fetchAmisKePrices,
  fetchAmisKeMarkets
} from '@/services/api';
import { Market, Forecast, Warehouse } from '@/types';
import { mockTransporters } from '@/features/ai-assistant/mockData';

export function useAssistantData(componentName = 'FarmerAIAssistant') {
  const { toast } = useToast();
  const { measureInteraction } = usePerformance(componentName);
  const componentMounted = useRef(true);
  
  // Data states
  const [markets, setMarkets] = useState<Market[]>([]);
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [transporters, setTransporters] = useState<any[]>(mockTransporters);
  const [amisPrices, setAmisPrices] = useState<any[]>([]);
  const [amisMarkets, setAmisMarkets] = useState<any[]>([]);
  
  // Loading states
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataLoadRetries, setDataLoadRetries] = useState(0);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    const endMeasure = measureInteraction('dataFetch');
    setDataLoading(true);
    setError(null);
    
    try {
      // First attempt to fetch direct API data
      const [marketsData, forecastsData, warehousesData, amisPricesData, amisMarketsData] = await Promise.all([
        fetchMarkets(),
        fetchForecasts(),
        fetchWarehouses(),
        fetchAmisKePrices(),
        fetchAmisKeMarkets()
      ]);
      
      // Ensure component is still mounted before updating state
      if (componentMounted.current) {
        console.log("Data loaded successfully:", {
          markets: marketsData.length,
          forecasts: forecastsData.length,
          warehouses: warehousesData.length,
          amisPrices: amisPricesData.length,
          amisMarkets: amisMarketsData.length
        });
        
        setMarkets(marketsData);
        setForecasts(forecastsData);
        setWarehouses(warehousesData);
        setAmisPrices(amisPricesData);
        setAmisMarkets(amisMarketsData);
        setDataLoadRetries(0);
      }
    } catch (error) {
      console.error('Error fetching data for AI assistant:', error);
      if (componentMounted.current) {
        setError('Could not load agricultural market data. Please try refreshing the page.');
        toast({
          title: "Data Loading Error",
          description: "Could not load market data. Using cached data if available.",
          variant: "destructive"
        });

        // If we have less than 3 retries, try again after a delay
        if (dataLoadRetries < 3) {
          const retryTimeout = setTimeout(() => {
            setDataLoadRetries(prev => prev + 1);
            fetchData();
          }, 3000); // 3 second delay before retry
          
          return () => clearTimeout(retryTimeout);
        }
      }
    } finally {
      if (componentMounted.current) {
        setDataLoading(false);
        endMeasure();
      }
    }
  }, [toast, measureInteraction, dataLoadRetries]);
  
  // Fetch necessary data on component mount
  useEffect(() => {
    componentMounted.current = true;
    fetchData();
    
    return () => {
      componentMounted.current = false;
    };
  }, [fetchData]);

  return {
    data: {
      markets,
      forecasts,
      warehouses,
      transporters,
      amisPrices,
      amisMarkets
    },
    dataLoading,
    error
  };
}
