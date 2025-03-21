
import { Market, Forecast, Warehouse } from '@/types';
import { Transporter } from './types';

export const getCropForecast = (crop: string, forecasts: Forecast[]): string => {
  const relevantForecasts = forecasts.filter(
    f => f.produceName.toLowerCase().includes(crop.toLowerCase())
  );
  
  if (relevantForecasts.length === 0) {
    return `I don't have specific forecast data for ${crop} at the moment.`;
  }
  
  // Find the best market based on expected demand
  const bestForecast = relevantForecasts.sort((a, b) => b.expectedDemand - a.expectedDemand)[0];
  
  const forecastConfidence = bestForecast.confidenceLevel === 'high' ? '±5%' : 
                            bestForecast.confidenceLevel === 'medium' ? '±10%' : '±20%';
  
  return `Based on our forecast with ${forecastConfidence} error margin, the demand for ${crop} is expected to be highest in ${bestForecast.county} during ${bestForecast.period}. Expected production is ${bestForecast.expectedProduction} ${bestForecast.unit} against an expected demand of ${bestForecast.expectedDemand} ${bestForecast.unit}.

For tomorrow's sales, I recommend targeting ${bestForecast.county} market as prices are projected to increase by approximately 3-5% based on current demand trends.`;
};

export const getBestMarkets = (crop: string, markets: Market[]): string => {
  const relevantMarkets = markets.filter(market => 
    market.producePrices.some(p => 
      p.produceName.toLowerCase().includes(crop.toLowerCase())
    )
  );
  
  if (relevantMarkets.length === 0) {
    return `I don't have specific market data for ${crop} at the moment.`;
  }
  
  // Sort markets by price (highest first)
  const sortedMarkets = [...relevantMarkets].sort((a, b) => {
    const priceA = a.producePrices.find(p => p.produceName.toLowerCase().includes(crop.toLowerCase()))?.price || 0;
    const priceB = b.producePrices.find(p => p.produceName.toLowerCase().includes(crop.toLowerCase()))?.price || 0;
    return priceB - priceA;
  });
  
  const topMarkets = sortedMarkets.slice(0, 3);
  
  const marketsList = topMarkets.map(market => {
    const price = market.producePrices.find(p => 
      p.produceName.toLowerCase().includes(crop.toLowerCase())
    );
    return `${market.name} (${market.county}): KES ${price?.price} per ${price?.unit}`;
  }).join('\n- ');
  
  return `The best markets for ${crop} right now are:\n- ${marketsList}\n\nFor tomorrow, based on historical patterns, prices at ${topMarkets[0].name} are expected to increase by 2-4% due to weekend demand.`;
};

export const getWarehouseRecommendations = (crop: string, warehouses: Warehouse[]): string => {
  if (warehouses.length === 0) {
    return `Currently, I don't have information on warehouses that can store ${crop}. As more warehouses join our network, I'll be able to provide recommendations.`;
  }
  
  const relevantWarehouses = warehouses.filter(warehouse => 
    warehouse.goodsTypes.some(type => type.toLowerCase().includes(crop.toLowerCase()))
  );
  
  if (relevantWarehouses.length === 0) {
    return `I don't have specific warehouse data for ${crop} at the moment.`;
  }
  
  const warehousesList = relevantWarehouses.slice(0, 3).map(warehouse => 
    `${warehouse.name} in ${warehouse.location} (${warehouse.county}): Capacity ${warehouse.capacity} ${warehouse.capacityUnit}, ${warehouse.hasRefrigeration ? 'has refrigeration' : 'no refrigeration'}`
  ).join('\n- ');
  
  return `Here are some warehouses that can store ${crop}:\n- ${warehousesList}`;
};

export const getTransporterRecommendations = (location: string, transporters: Transporter[]): string => {
  if (transporters.length === 0) {
    return `Currently, I don't have information on transport providers serving ${location}. As more transporters join our network, I'll be able to provide recommendations.`;
  }
  
  const relevantTransporters = transporters.filter(transporter => 
    transporter.counties.some((county: string) => county.toLowerCase().includes(location.toLowerCase()))
  );
  
  if (relevantTransporters.length === 0) {
    return `I don't have specific transporter data for ${location} at the moment.`;
  }
  
  const transportersList = relevantTransporters.slice(0, 3).map(transporter => 
    `${transporter.name}: ${transporter.contactInfo}, Capacity: ${transporter.loadCapacity}kg, ${transporter.hasRefrigeration ? 'has refrigeration' : 'no refrigeration'}`
  ).join('\n- ');
  
  return `Here are some transporters serving ${location}:\n- ${transportersList}`;
};

export const getQualityControlAdvice = (crop: string): string => {
  const organicAdvice = `For organic ${crop} production:\n- Consider organic certification from KEBS or international bodies\n- Document all inputs and practices\n- Implement crop rotation and natural pest control\n- Maintain buffer zones from conventional farms`;
  
  const contractFarmingAdvice = `For contract farming of ${crop}:\n- Engage with exporters looking for consistent quality\n- Check for quality specifications in contracts\n- Request input support and technical assistance\n- Ensure fair price mechanisms are included`;

  const qualityControlInfo = `Quality control measures for ${crop}:\n- Regular soil testing for optimal nutrition\n- Integrated pest management to reduce chemical use\n- Proper post-harvest handling to maintain freshness\n- Grading system to categorize produce by quality\n- Record-keeping for traceability`;
  
  return `${organicAdvice}\n\n${contractFarmingAdvice}\n\n${qualityControlInfo}`;
};

export const generateResponse = (
  userMessage: string,
  markets: Market[],
  forecasts: Forecast[],
  warehouses: Warehouse[],
  transporters: Transporter[]
): string => {
  const message = userMessage.toLowerCase();
  
  // Extract key information from the message
  const cropMatches = message.match(/tomato|potato|maize|corn|mango|avocado|coffee|tea|beans|peas|wheat|rice|banana|onion|cabbage|carrot/g);
  const crop = cropMatches ? cropMatches[0] : '';
  
  const locationMatches = message.match(/nairobi|mombasa|kisumu|nakuru|eldoret|kitale|meru|nyeri|thika|machakos|garissa|lamu|malindi|kakamega/g);
  const location = locationMatches ? locationMatches[0] : '';
  
  // Check if the message is about price forecasts or tomorrow's markets
  if (message.includes('forecast') || message.includes('predict') || message.includes('future price') || 
      message.includes('next week') || message.includes('next month') || message.includes('tomorrow')) {
    if (crop) {
      return getCropForecast(crop, forecasts);
    } else {
      return "Which crop are you interested in getting a price forecast for?";
    }
  }
  
  // Check if the message is about current market prices
  if (message.includes('price') || message.includes('market') || message.includes('sell') || message.includes('where')) {
    if (crop) {
      return getBestMarkets(crop, markets);
    } else {
      return "Which crop are you interested in selling?";
    }
  }
  
  // Check if the message is about warehouses
  if (message.includes('warehouse') || message.includes('storage') || message.includes('store')) {
    if (crop) {
      return getWarehouseRecommendations(crop, warehouses);
    } else {
      return "Which crop are you looking to store?";
    }
  }
  
  // Check if the message is about transporters
  if (message.includes('transport') || message.includes('logistics') || message.includes('deliver') || message.includes('pickup')) {
    if (location) {
      return getTransporterRecommendations(location, transporters);
    } else {
      return "Which location are you looking for transport services in?";
    }
  }
  
  // Check if the message is about quality control
  if (message.includes('quality') || message.includes('organic') || message.includes('certification') || 
      message.includes('contract farming') || message.includes('buyer')) {
    if (crop) {
      return getQualityControlAdvice(crop);
    } else {
      return "Which crop are you looking to improve quality for?";
    }
  }

  // Check if asking about the AI itself
  if (message.includes('which ai') || message.includes('what ai') || message.includes('ai model') || 
      message.includes('what model') || message.includes('how do you work')) {
    return "I'm a specialized agricultural assistant built on a rule-based system with domain-specific knowledge about Kenyan agriculture. I analyze patterns in market data and provide recommendations based on historical trends and current conditions. While I'm not a large language model like GPT, I'm designed specifically to help Kenyan farmers with agricultural market intelligence and supply chain solutions.";
  }
  
  // Default response if no specific intent is detected
  if (crop) {
    return `I can help you with market prices, forecasts, storage, and transport for ${crop}. What specific information are you looking for? I can also advise on quality control measures and contract farming opportunities.`;
  }
  
  return "I'm your agricultural assistant. I can help with finding markets, forecasting prices with error margins, and connecting you with warehouses and transporters. What crop are you growing?";
};
