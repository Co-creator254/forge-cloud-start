
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
  transporters: Transporter[]
): string => {
  const { type, crop, location, product, policy, technology } = intent;
  
  switch(type) {
    case 'greeting':
      return getResponseForGreeting();
      
    case 'thanks':
      return getResponseForThanks();
      
    case 'aboutAI':
      return getResponseForAboutAI();
      
    case 'counterfeit':
      if (product && location) {
        return detectCounterfeitAlert(product, location);
      } else if (product) {
        return `I can check for counterfeit alerts regarding ${product}. Which location are you interested in?`;
      } else if (location) {
        return `I can check for counterfeit alerts in ${location}. What product are you concerned about?`;
      } else {
        return "I can check for counterfeit alerts based on collective farmer intelligence. Please specify which agricultural input (like fertilizer, seeds, pesticides) and location you're interested in.";
      }
      
    case 'disease':
      if (crop && location) {
        return getDiseaseAlert(crop, location);
      } else if (crop) {
        return `I can check for disease alerts for ${crop}. Which location are you interested in?`;
      } else if (location) {
        return `I can check for disease alerts in ${location}. Which crop are you concerned about?`;
      } else {
        return "I can provide disease alerts based on collective farmer intelligence. Please specify which crop and location you're interested in.";
      }
      
    case 'policy':
      if (policy && location) {
        return getPolicyImplementationGap(policy, location);
      } else if (policy) {
        return `I can check farmer feedback on the implementation of ${policy} policies. Which location are you interested in?`;
      } else if (location) {
        return `I can provide insights on policy implementation gaps in ${location}. Which agricultural policy are you interested in?`;
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
      if (crop) {
        return generateSentimentBasedInsight('', crop);
      } else {
        return "I can provide collective intelligence insights based on aggregated farmer experiences. Which specific crop or agricultural topic would you like insights about?";
      }
      
    case 'forecast':
      if (crop) {
        return getCropForecast(crop, forecasts);
      } else {
        return "Which crop are you interested in getting a price forecast for? I can provide insights on tomatoes, potatoes, maize, mangoes, avocados, and many other common crops.";
      }
      
    case 'market':
      if (crop) {
        return getBestMarkets(crop, markets);
      } else {
        return "Which crop are you interested in selling? I can help you find the best markets for various crops including tomatoes, potatoes, maize, beans, and many others.";
      }
      
    case 'warehouse':
      if (crop) {
        return getWarehouseRecommendations(crop, warehouses);
      } else {
        return "Which crop are you looking to store? I can recommend warehouses that are suitable for various crops, including those requiring refrigeration.";
      }
      
    case 'transport':
      if (location) {
        return getTransporterRecommendations(location, transporters);
      } else {
        return "Which location are you looking for transport services in? I can help find transporters in major counties like Nairobi, Mombasa, Kisumu, and many others.";
      }
      
    case 'buyers':
      if (crop && location) {
        return getPotentialBuyers(crop, location);
      } else if (crop) {
        return `Which location are you interested in finding buyers for ${crop}? I can help connect you with potential buyers in different regions.`;
      } else if (location) {
        return `What crop are you looking to sell to buyers in ${location}? I can help identify potential buyers for specific crops.`;
      } else {
        return "Which crop and location are you interested in finding buyers for? I can help connect you with potential buyers for various crops across different regions.";
      }
      
    case 'supplyChain':
      if (crop) {
        return getSupplyChainSolutions(crop);
      } else {
        return "Which crop would you like supply chain solutions for? I can provide ethical and sustainable approaches for various crops.";
      }
      
    case 'qualityControl':
      if (crop) {
        return getQualityControlAdvice(crop);
      } else {
        return "Which crop are you looking to improve quality for? I can provide guidance on quality control measures, organic certification, and contract farming for various crops.";
      }
      
    case 'general':
    default:
      if (crop) {
        return `I can help you with market prices, forecasts, storage, transport, finding buyers, suggesting ethical supply chain solutions, and providing collective intelligence insights for ${crop}. What specific information are you looking for?`;
      }
      
      return "I'm your ethical agricultural assistant powered by open-source technology. I can help with finding markets, forecasting prices with error margins, connecting you with warehouses and transporters, finding potential buyers, suggesting ethical supply chain solutions, and providing collective intelligence on counterfeits, diseases, policies, and technologies. What agricultural information do you need today?";
  }
};
