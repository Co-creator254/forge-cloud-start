
/**
 * Market Data Processor using LangChain for AI Assistant
 * This service integrates with LangChain to process market data and provide enhanced responses
 */

import { Market, Forecast, Warehouse } from '@/types';

// Interface for structured market data format
interface ProcessedMarketData {
  marketName: string;
  countyName: string;
  commodities: {
    name: string;
    currentPrice: number;
    priceChange: number;
    demandTrend: 'rising' | 'stable' | 'falling';
    supplyLevel: 'high' | 'medium' | 'low';
  }[];
}

// Interface for forecast data with confidence levels
interface EnhancedForecast {
  commodity: string;
  currentPrice: number;
  forecastPrice: number;
  confidence: number;
  factors: string[];
  timePeriod: string;
}

class MarketDataProcessor {
  // Process raw market data into a structured format for the AI
  processMarketData(markets: Market[]): ProcessedMarketData[] {
    const processedData: ProcessedMarketData[] = [];
    
    // Group markets by location
    const marketsByLocation: Record<string, Market[]> = {};
    markets.forEach(market => {
      const locationKey = `${market.location.county}-${market.name}`;
      if (!marketsByLocation[locationKey]) {
        marketsByLocation[locationKey] = [];
      }
      marketsByLocation[locationKey].push(market);
    });
    
    // Process each location group
    Object.entries(marketsByLocation).forEach(([locationKey, marketsInLocation]) => {
      const [countyName, marketName] = locationKey.split('-');
      
      // Group commodities in this market
      const commoditiesMap = new Map<string, {
        name: string;
        currentPrice: number;
        priceChange: number;
        demandTrend: 'rising' | 'stable' | 'falling';
        supplyLevel: 'high' | 'medium' | 'low';
      }>();
      
      marketsInLocation.forEach(market => {
        if (!commoditiesMap.has(market.commodity)) {
          // Calculate demand trend based on available data
          const demandTrend = this.calculateDemandTrend(market.priceHistory || []);
          
          commoditiesMap.set(market.commodity, {
            name: market.commodity,
            currentPrice: market.currentPrice,
            priceChange: market.priceChange || 0,
            demandTrend,
            supplyLevel: this.determineSupplyLevel(market.volume || 0),
          });
        }
      });
      
      // Create processed data entry
      processedData.push({
        marketName: marketName || 'Unknown Market',
        countyName: countyName || 'Unknown County',
        commodities: Array.from(commoditiesMap.values()),
      });
    });
    
    return processedData;
  }
  
  // Process forecasts with error margins and confidence levels
  processForecasts(forecasts: Forecast[]): EnhancedForecast[] {
    return forecasts.map(forecast => {
      // Calculate confidence based on historical accuracy and data quality
      const confidence = this.calculateConfidenceLevel(forecast);
      
      return {
        commodity: forecast.commodity,
        currentPrice: forecast.currentPrice,
        forecastPrice: forecast.predictedPrice,
        confidence,
        factors: forecast.factors || ['Market demand', 'Seasonal trends'],
        timePeriod: forecast.horizon || 'next week',
      };
    });
  }
  
  // Calculate demand trend from price history
  private calculateDemandTrend(priceHistory: number[]): 'rising' | 'stable' | 'falling' {
    if (!priceHistory || priceHistory.length < 2) {
      return 'stable';
    }
    
    // Calculate the average change over the last periods
    const changes: number[] = [];
    for (let i = 1; i < priceHistory.length; i++) {
      changes.push(priceHistory[i] - priceHistory[i-1]);
    }
    
    const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
    
    if (avgChange > 5) return 'rising';
    if (avgChange < -5) return 'falling';
    return 'stable';
  }
  
  // Determine supply level based on volume
  private determineSupplyLevel(volume: number): 'high' | 'medium' | 'low' {
    if (volume > 1000) return 'high';
    if (volume > 500) return 'medium';
    return 'low';
  }
  
  // Calculate confidence level for forecast
  private calculateConfidenceLevel(forecast: Forecast): number {
    // Default medium confidence
    let confidence = 0.7;
    
    // Adjust based on data quality and historical accuracy
    if (forecast.accuracy && forecast.accuracy > 0.8) {
      confidence += 0.2;
    } else if (forecast.accuracy && forecast.accuracy < 0.5) {
      confidence -= 0.2;
    }
    
    // Adjust based on data completeness
    if (!forecast.factors || forecast.factors.length === 0) {
      confidence -= 0.1;
    }
    
    // Ensure confidence is between 0.3 and 0.95
    return Math.max(0.3, Math.min(0.95, confidence));
  }
  
  // Find best markets for a specific crop
  findBestMarketsForCrop(markets: Market[], crop: string): Market[] {
    const relevantMarkets = markets.filter(market => 
      market.commodity.toLowerCase() === crop.toLowerCase()
    );
    
    // Sort by price (highest first for sellers)
    return relevantMarkets.sort((a, b) => b.currentPrice - a.currentPrice);
  }
  
  // Find most suitable warehouses for a crop
  findWarehousesForCrop(warehouses: Warehouse[], crop: string): Warehouse[] {
    const cropLower = crop.toLowerCase();
    
    // Find warehouses suitable for the crop
    const suitableWarehouses = warehouses.filter(warehouse => {
      // Check if explicitly supports this crop
      if (warehouse.supportedCrops && 
          warehouse.supportedCrops.some(c => c.toLowerCase().includes(cropLower))) {
        return true;
      }
      
      // Check if has required storage type (cold storage for fruits/vegetables)
      const needsColdStorage = ['fruit', 'vegetable', 'tomato', 'mango', 'avocado'].some(
        type => cropLower.includes(type)
      );
      
      if (needsColdStorage && warehouse.hasColdStorage) {
        return true;
      }
      
      // Check for cereal storage
      const isCereal = ['maize', 'wheat', 'rice', 'beans', 'cereals'].some(
        type => cropLower.includes(type)
      );
      
      if (isCereal && warehouse.type === 'dry storage') {
        return true;
      }
      
      return false;
    });
    
    return suitableWarehouses;
  }
}

export const marketDataProcessor = new MarketDataProcessor();
export default marketDataProcessor;
