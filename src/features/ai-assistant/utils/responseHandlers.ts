
import { MessageIntent } from './messageParser';
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from '../types';
import { getCropForecast } from './cropForecasts';
import { getBestMarkets } from './marketAnalysis';
import { getWarehouseRecommendations, getTransporterRecommendations } from './logistics';
import { 
  getPotentialBuyers, 
  getSupplyChainSolutions,
  getQualityControlAdvice 
} from './businessSolutions';
import {
  detectCounterfeitAlert,
  getDiseaseAlert,
  getPolicyImplementationGap,
  getTechnologyAdoptionSentiment,
  generateSentimentBasedInsight
} from './sentimentAnalysis';

interface ContextData {
  crop?: string;
  location?: string;
  relevantMarkets?: Market[];
  relevantWarehouses?: Warehouse[];
  processedMarkets?: any[];
  processedForecasts?: any[];
}

export const getResponseForGreeting = (): string => {
  return "Hello! I'm your ethical agricultural assistant. I can help with finding markets, forecasting prices with error margins, connecting you with warehouses and transporters, finding potential buyers, suggesting ethical supply chain solutions, and analyzing collective farmer intelligence on counterfeits, diseases, policies, and technologies. What agricultural information do you need today?";
};

export const getResponseForThanks = (): string => {
  return "You're welcome! I'm glad I could help. Is there anything else you'd like to know about agricultural markets, potential buyers, ethical supply chain solutions, or collective farmer intelligence?";
};

export const getResponseForAboutAI = (): string => {
  return "I'm a specialized agricultural assistant built on open-source AI technology. I analyze patterns in market data and provide recommendations based on historical trends, current conditions, and collective farmer intelligence. I prioritize ethical considerations in all my recommendations, including fair pricing, sustainable practices, and transparent supply chains. I can help with market insights, disease alerts, counterfeit warnings, and technology adoption guidance. How can I assist you today?";
};

export const getResponseForIntent = (
  intent: MessageIntent,
  markets: Market[],
  forecasts: Forecast[],
  warehouses: Warehouse[],
  transporters: Transporter[],
  contextData?: ContextData
): string => {
  const { type, crop, location, product, policy, technology } = intent;
  
  // Use context data if available, otherwise fall back to intent data
  const cropName = contextData?.crop || crop;
  const locationName = contextData?.location || location;
  const relevantMarkets = contextData?.relevantMarkets || [];
  const relevantWarehouses = contextData?.relevantWarehouses || [];
  
  switch(type) {
    case 'greeting':
      return getResponseForGreeting();
      
    case 'thanks':
      return getResponseForThanks();
      
    case 'aboutAI':
      return getResponseForAboutAI();
      
    case 'counterfeit':
      if (product && locationName) {
        return detectCounterfeitAlert(product, locationName);
      } else if (product) {
        return `I can check for counterfeit alerts regarding ${product}. Which location are you interested in?`;
      } else if (locationName) {
        return `I can check for counterfeit alerts in ${locationName}. What product are you concerned about?`;
      } else {
        return "I can check for counterfeit alerts based on collective farmer intelligence. Please specify which agricultural input (like fertilizer, seeds, pesticides) and location you're interested in.";
      }
      
    case 'disease':
      if (cropName && locationName) {
        return getDiseaseAlert(cropName, locationName);
      } else if (cropName) {
        return `I can check for disease alerts for ${cropName}. Which location are you interested in?`;
      } else if (locationName) {
        return `I can check for disease alerts in ${locationName}. Which crop are you concerned about?`;
      } else {
        return "I can provide disease alerts based on collective farmer intelligence. Please specify which crop and location you're interested in.";
      }
      
    case 'policy':
      if (policy && locationName) {
        return getPolicyImplementationGap(policy, locationName);
      } else if (policy) {
        return `I can check farmer feedback on the implementation of ${policy} policies. Which location are you interested in?`;
      } else if (locationName) {
        return `I can provide insights on policy implementation gaps in ${locationName}. Which agricultural policy are you interested in?`;
      } else {
        return "I can analyze policy implementation gaps based on collective farmer intelligence. Please specify which agricultural policy (like subsidies, loans, insurance) and location you're interested in.";
      }
      
    case 'technology':
      if (technology) {
        return getTechnologyAdoptionSentiment(technology);
      } else {
        return "I can provide insights on farmer sentiment toward agricultural technologies. Which specific technology (like irrigation systems, sensors, drones, mobile apps) are you interested in?";
      }
      
    case 'insights':
      if (cropName) {
        return generateSentimentBasedInsight('', cropName);
      } else {
        return "I can provide collective intelligence insights based on aggregated farmer experiences. Which specific crop or agricultural topic would you like insights about?";
      }
      
    case 'forecast':
      if (cropName) {
        // Use enhanced forecasts if available
        if (contextData?.processedForecasts) {
          const forecast = contextData.processedForecasts.find(f => 
            f.commodity.toLowerCase() === cropName.toLowerCase()
          );
          
          if (forecast) {
            return `Based on my analysis, the current price of ${cropName} is KES ${forecast.currentPrice}/kg. 
I forecast that prices will be around KES ${forecast.forecastPrice}/kg in ${forecast.timePeriod} 
(confidence level: ${Math.round(forecast.confidence * 100)}%).
            
Key factors affecting this forecast:
${forecast.factors.map(f => `- ${f}`).join('\n')}

This forecast incorporates current market conditions, historical trends, and environmental factors.`;
          }
        }
        
        // Fall back to standard forecast if enhanced data not available
        return getCropForecast(cropName, forecasts);
      } else {
        return "Which crop are you interested in getting a price forecast for? I can provide insights on tomatoes, potatoes, maize, mangoes, avocados, and many other common crops.";
      }
      
    case 'market':
      if (cropName) {
        // Use relevantMarkets if available
        if (relevantMarkets.length > 0) {
          const topMarkets = relevantMarkets.slice(0, 3);
          
          const marketList = topMarkets.map(market => 
            `- ${market.name} in ${market.location.county}: KES ${market.currentPrice}/kg (${market.priceChange > 0 ? 'up' : 'down'} ${Math.abs(market.priceChange || 0)}%)`
          ).join('\n');
          
          return `Based on current data, here are the top markets for ${cropName}:\n\n${marketList}\n\nThese markets are showing the highest prices and demand for your crop right now.`;
        }
        
        // Fall back to standard market info
        return getBestMarkets(cropName, markets);
      } else {
        return "Which crop are you interested in selling? I can help you find the best markets for various crops including tomatoes, potatoes, maize, beans, and many others.";
      }
      
    case 'warehouse':
      if (cropName) {
        // Use relevantWarehouses if available
        if (relevantWarehouses.length > 0) {
          const topWarehouses = relevantWarehouses.slice(0, 3);
          
          const warehouseList = topWarehouses.map(warehouse => 
            `- ${warehouse.name} in ${warehouse.location.county}: ${warehouse.hasColdStorage ? 'Has cold storage, ' : ''}Storage cost: KES ${warehouse.costPerUnit}/unit`
          ).join('\n');
          
          return `Here are the recommended warehouses for storing ${cropName}:\n\n${warehouseList}\n\nThese facilities have appropriate conditions for your crop and are verified for quality.`;
        }
        
        // Fall back to standard warehouse info
        return getWarehouseRecommendations(cropName, warehouses);
      } else {
        return "Which crop are you looking to store? I can recommend warehouses that are suitable for various crops, including those requiring refrigeration.";
      }
      
    case 'transport':
      if (locationName) {
        return getTransporterRecommendations(locationName, transporters);
      } else {
        return "Which location are you looking for transport services in? I can help find transporters in major counties like Nairobi, Mombasa, Kisumu, and many others.";
      }
      
    case 'buyers':
      if (cropName && locationName) {
        return getPotentialBuyers(cropName, locationName);
      } else if (cropName) {
        return `Which location are you interested in finding buyers for ${cropName}? I can help connect you with potential buyers in different regions.`;
      } else if (locationName) {
        return `What crop are you looking to sell to buyers in ${locationName}? I can help identify potential buyers for specific crops.`;
      } else {
        return "Which crop and location are you interested in finding buyers for? I can help connect you with potential buyers for various crops across different regions.";
      }
      
    case 'supplyChain':
      if (cropName) {
        return getSupplyChainSolutions(cropName);
      } else {
        return "Which crop would you like supply chain solutions for? I can provide ethical and sustainable approaches for various crops.";
      }
      
    case 'qualityControl':
      if (cropName) {
        return getQualityControlAdvice(cropName);
      } else {
        return "Which crop are you looking to improve quality for? I can provide guidance on quality control measures, organic certification, and contract farming for various crops.";
      }
      
    case 'general':
    default:
      if (cropName) {
        return `I can help you with market prices, forecasts, storage, transport, finding buyers, suggesting ethical supply chain solutions, and providing collective intelligence insights for ${cropName}. What specific information are you looking for?`;
      }
      
      return "I'm your ethical agricultural assistant powered by open-source technology. I can help with finding markets, forecasting prices with error margins, connecting you with warehouses and transporters, finding potential buyers, suggesting ethical supply chain solutions, and providing collective intelligence on counterfeits, diseases, policies, and technologies. What agricultural information do you need today?";
  }
};
