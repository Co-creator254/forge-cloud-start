
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
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Anti-flickering measure: Ensure loading state stays for at least 800ms
  // This prevents the UI from rapidly toggling between loading and loaded states
  const setLoadingWithMinDuration = useCallback((isLoading: boolean) => {
    if (isLoading) {
      setDataLoading(true);
      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
    } else {
      // Ensure loading state stays for at least 800ms to prevent flickering
      const timeInLoadingState = lastUpdated ? Date.now() - lastUpdated.getTime() : 0;
      const minLoadingTime = 800; // milliseconds
      
      if (timeInLoadingState >= minLoadingTime) {
        setDataLoading(false);
      } else {
        loadingTimeoutRef.current = setTimeout(() => {
          if (componentMounted.current) {
            setDataLoading(false);
          }
        }, minLoadingTime - timeInLoadingState);
      }
    }
  }, [lastUpdated]);

  // Use cache to prevent unnecessary API calls and reduce flickering
  const useDataCache = useCallback(<T>(key: string, data: T): T => {
    // If we have data, store it in localStorage (for session persistence)
    if (data && Array.isArray(data) && data.length > 0) {
      try {
        localStorage.setItem(`amis_cache_${key}`, JSON.stringify({
          timestamp: Date.now(),
          data
        }));
      } catch (e) {
        console.warn(`Failed to cache ${key} data`, e);
      }
    }
    
    // Return the data as-is
    return data;
  }, []);

  // Get data from cache if available and not expired
  const getDataFromCache = useCallback(<T>(key: string, maxAge = 30 * 60 * 1000): T | null => {
    try {
      const cachedItem = localStorage.getItem(`amis_cache_${key}`);
      if (cachedItem) {
        const { timestamp, data } = JSON.parse(cachedItem);
        
        // Check if cache is still valid (default: 30 minutes)
        if (Date.now() - timestamp < maxAge) {
          console.log(`Using cached ${key} data from ${new Date(timestamp).toLocaleTimeString()}`);
          return data as T;
        }
      }
    } catch (e) {
      console.warn(`Failed to retrieve ${key} data from cache`, e);
    }
    
    return null;
  }, []);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async () => {
    const endMeasure = measureInteraction('dataFetch');
    setLoadingWithMinDuration(true);
    setLastUpdated(new Date());
    setError(null);
    
    try {
      // Try to get data from cache first
      const cachedMarkets = getDataFromCache<Market[]>('markets');
      const cachedForecasts = getDataFromCache<Forecast[]>('forecasts');
      const cachedWarehouses = getDataFromCache<Warehouse[]>('warehouses');
      const cachedAmisPrices = getDataFromCache<any[]>('amisPrices');
      const cachedAmisMarkets = getDataFromCache<any[]>('amisMarkets');
      
      // Fetch any data that isn't in cache
      const [
        marketsData, 
        forecastsData, 
        warehousesData, 
        amisPricesData, 
        amisMarketsData
      ] = await Promise.all([
        cachedMarkets || fetchMarkets(),
        cachedForecasts || fetchForecasts(),
        cachedWarehouses || fetchWarehouses(),
        cachedAmisPrices || fetchAmisKePrices(),
        cachedAmisMarkets || fetchAmisKeMarkets()
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
        
        // Cache data for future use
        setMarkets(useDataCache('markets', marketsData));
        setForecasts(useDataCache('forecasts', forecastsData));
        setWarehouses(useDataCache('warehouses', warehousesData));
        setAmisPrices(useDataCache('amisPrices', amisPricesData));
        setAmisMarkets(useDataCache('amisMarkets', amisMarketsData));
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
        setLoadingWithMinDuration(false);
        endMeasure();
      }
    }
  }, [
    toast, 
    measureInteraction, 
    dataLoadRetries, 
    setLoadingWithMinDuration, 
    getDataFromCache, 
    useDataCache
  ]);
  
  // Fetch necessary data on component mount
  useEffect(() => {
    componentMounted.current = true;
    fetchData();
    
    return () => {
      componentMounted.current = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
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
    error,
    refreshData: fetchData,
    lastUpdated
  };
}
