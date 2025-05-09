
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from './types';
import { detectLanguage, handleLanguageResponse } from './utils/languageSupport';
import { detectIntent, extractCropFromMessage, extractLocationFromMessage } from './utils/messageParser';
import { getResponseForIntent } from './utils/responseHandlers';
import { marketDataProcessor } from '@/services/langchain/market-data-processor';

export const generateResponse = (
  userMessage: string,
  markets: Market[],
  forecasts: Forecast[],
  warehouses: Warehouse[],
  transporters: Transporter[]
): string => {
  try {
    const message = userMessage.toLowerCase();
    const detectedLanguage = detectLanguage(message);
    
    // Extract important entities from the message
    const crop = extractCropFromMessage(message);
    const location = extractLocationFromMessage(message);
    
    // Process market data for more accurate responses
    const processedMarkets = marketDataProcessor.processMarketData(markets);
    const processedForecasts = marketDataProcessor.processForecasts(forecasts);
    
    // If crop is mentioned, find relevant data
    let relevantMarkets: Market[] = [];
    let relevantWarehouses: Warehouse[] = [];
    
    if (crop) {
      relevantMarkets = marketDataProcessor.findBestMarketsForCrop(markets, crop);
      relevantWarehouses = marketDataProcessor.findWarehousesForCrop(warehouses, crop);
    }
    
    // If not English, use language-specific responses
    if (detectedLanguage !== 'english') {
      const languageResponse = handleLanguageResponse(message, detectedLanguage);
      
      if (languageResponse) {
        return languageResponse;
      }
    }
    
    // Get the user's intent and generate appropriate response
    const intent = detectIntent(message);
    
    const contextData = {
      crop,
      location,
      relevantMarkets,
      relevantWarehouses,
      processedMarkets,
      processedForecasts
    };
    
    return getResponseForIntent(intent, markets, forecasts, warehouses, transporters, contextData);
    
  } catch (error) {
    console.error("Error in generateResponse:", error);
    return "I apologize, but I encountered an unexpected error. Could you please rephrase your question or try asking about a different topic?";
  }
};
