
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from './types';
import { getCropForecast } from './utils/cropForecasts';
import { getBestMarkets } from './utils/marketAnalysis';
import { getWarehouseRecommendations, getTransporterRecommendations } from './utils/logistics';
import { 
  getPotentialBuyers, 
  getSupplyChainSolutions,
  getQualityControlAdvice 
} from './utils/businessSolutions';

export const generateResponse = (
  userMessage: string,
  markets: Market[],
  forecasts: Forecast[],
  warehouses: Warehouse[],
  transporters: Transporter[]
): string => {
  try {
    const message = userMessage.toLowerCase();
    
    // Extract key information from the message
    const cropMatches = message.match(/tomato|potato|maize|corn|mango|avocado|coffee|tea|beans|peas|wheat|rice|banana|onion|cabbage|carrot/g);
    const crop = cropMatches ? cropMatches[0] : '';
    
    const locationMatches = message.match(/nairobi|mombasa|kisumu|nakuru|eldoret|kitale|meru|nyeri|thika|machakos|garissa|lamu|malindi|kakamega/g);
    const location = locationMatches ? locationMatches[0] : '';
    
    // Check for greetings or general inquiries
    if (message.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/i)) {
      return "Hello! I'm your agricultural assistant. I can help with finding markets, forecasting prices with error margins, connecting you with warehouses and transporters, finding potential buyers, and suggesting ethical supply chain solutions. What crop are you growing or what agricultural information do you need today?";
    }
    
    // Check for thank you messages
    if (message.match(/thank you|thanks|appreciate|helpful/i)) {
      return "You're welcome! I'm glad I could help. Is there anything else you'd like to know about agricultural markets, potential buyers, or ethical supply chain solutions?";
    }
    
    // Check if the message is about price forecasts or tomorrow's markets
    if (message.includes('forecast') || message.includes('predict') || message.includes('future price') || 
        message.includes('next week') || message.includes('next month') || message.includes('tomorrow')) {
      if (crop) {
        return getCropForecast(crop, forecasts);
      } else {
        return "Which crop are you interested in getting a price forecast for? I can provide insights on tomatoes, potatoes, maize, mangoes, avocados, and many other common crops.";
      }
    }
    
    // Check if the message is about current market prices
    if (message.includes('price') || message.includes('market') || message.includes('sell') || message.includes('where')) {
      if (crop) {
        return getBestMarkets(crop, markets);
      } else {
        return "Which crop are you interested in selling? I can help you find the best markets for various crops including tomatoes, potatoes, maize, beans, and many others.";
      }
    }
    
    // Check if the message is about warehouses
    if (message.includes('warehouse') || message.includes('storage') || message.includes('store')) {
      if (crop) {
        return getWarehouseRecommendations(crop, warehouses);
      } else {
        return "Which crop are you looking to store? I can recommend warehouses that are suitable for various crops, including those requiring refrigeration.";
      }
    }
    
    // Check if the message is about transporters
    if (message.includes('transport') || message.includes('logistics') || message.includes('deliver') || message.includes('pickup')) {
      if (location) {
        return getTransporterRecommendations(location, transporters);
      } else {
        return "Which location are you looking for transport services in? I can help find transporters in major counties like Nairobi, Mombasa, Kisumu, and many others.";
      }
    }
    
    // Check if the message is about buyers
    if (message.includes('buyer') || message.includes('customer') || message.includes('purchaser') || 
        message.includes('looking for') || message.includes('who needs') || message.includes('who wants')) {
      if (crop && location) {
        return getPotentialBuyers(crop, location);
      } else if (crop) {
        return `Which location are you interested in finding buyers for ${crop}? I can help connect you with potential buyers in different regions.`;
      } else if (location) {
        return `What crop are you looking to sell to buyers in ${location}? I can help identify potential buyers for specific crops.`;
      } else {
        return "Which crop and location are you interested in finding buyers for? I can help connect you with potential buyers for various crops across different regions.";
      }
    }
    
    // Check if the message is about supply chain
    if (message.includes('supply chain') || message.includes('value chain') || message.includes('distribution') || 
        message.includes('logistics network') || message.includes('ethical') || message.includes('sustainable')) {
      if (crop) {
        return getSupplyChainSolutions(crop);
      } else {
        return "Which crop would you like supply chain solutions for? I can provide ethical and sustainable approaches for various crops.";
      }
    }
    
    // Check if the message is about quality control
    if (message.includes('quality') || message.includes('organic') || message.includes('certification') || 
        message.includes('contract farming') || message.includes('buyer')) {
      if (crop) {
        return getQualityControlAdvice(crop);
      } else {
        return "Which crop are you looking to improve quality for? I can provide guidance on quality control measures, organic certification, and contract farming for various crops.";
      }
    }
  
    // Check if asking about the AI itself
    if (message.includes('which ai') || message.includes('what ai') || message.includes('ai model') || 
        message.includes('what model') || message.includes('how do you work')) {
      return "I'm a specialized agricultural assistant built on open-source AI technology. I analyze patterns in market data and provide recommendations based on historical trends and current conditions. I prioritize ethical considerations in all my recommendations, including fair pricing, sustainable practices, and transparent supply chains. Is there a specific agricultural question I can help you with?";
    }
    
    // Default response if no specific intent is detected
    if (crop) {
      return `I can help you with market prices, forecasts, storage, transport, finding buyers, and suggesting ethical supply chain solutions for ${crop}. What specific information are you looking for?`;
    }
    
    return "I'm your agricultural assistant. I can help with finding markets, forecasting prices with error margins, connecting you with warehouses and transporters, finding potential buyers, and suggesting ethical supply chain solutions. What crop are you growing or what information do you need today?";
  } catch (error) {
    console.error("Error in generateResponse:", error);
    return "I apologize, but I encountered an unexpected error. Could you please rephrase your question or try asking about a different topic?";
  }
};

