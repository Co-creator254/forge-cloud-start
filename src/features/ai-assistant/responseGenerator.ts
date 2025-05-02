
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from './types';
import { detectLanguage, handleLanguageResponse } from './utils/languageSupport';
import { detectIntent, extractCropFromMessage, extractLocationFromMessage } from './utils/messageParser';
import { getResponseForIntent } from './utils/responseHandlers';

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
    
    // If not English, use language-specific responses
    if (detectedLanguage !== 'english') {
      const languageResponse = handleLanguageResponse(message, detectedLanguage);
      if (languageResponse) {
        return languageResponse;
      }
    }
    
    // For English or if language-specific response wasn't sufficient
    const intent = detectIntent(message);
    return getResponseForIntent(intent, markets, forecasts, warehouses, transporters);
    
  } catch (error) {
    console.error("Error in generateResponse:", error);
    return "I apologize, but I encountered an unexpected error. Could you please rephrase your question or try asking about a different topic?";
  }
};
